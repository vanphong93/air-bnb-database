import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, user } from '@prisma/client';
import { Response } from 'express';
import {
  checkEmpty,
  dataRequire,
  signProperty,
} from 'src/utilities/validation';
import { resultLogin, resultUpload, userLogin, userSign } from './dto';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getUser(): Promise<user[]> {
    const result = await this.prisma.user.findMany();
    // .then((data) => {
    //   data.forEach((item) => {
    //     item.passWord = '';
    //   });
    //   return data;
    // });
    return result;
  }
  async login({ email, passWord }: userLogin): Promise<resultLogin> {
    const checkUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (checkUser) {
      if (checkUser.passWord === passWord) {
        const token = this.jwt.sign(checkUser, {
          expiresIn: '2d',
          secret: this.config.get('SECRET_KEY'),
        });
        return { ...checkUser, token };
      } else {
        throw new HttpException(
          'Email or Pass word is wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Email is not found', HttpStatus.NOT_FOUND);
  }
  async signUp(body: userSign): Promise<user> {
    // const { email } = body;
    // const checkEmail = await this.prisma.user.findFirst({ where: { email } });
    // if (checkEmail) {
    //   throw new ConflictException(email, 'Email is already exists');
    // }
    const clientData = await this.prisma.user.create({ data: body });
    return clientData;
  }
  async getUserById(userID: number): Promise<user> {
    const result = await this.prisma.user.findFirst({ where: { userID } });
    // console.log('result: ', result);
    // .then((data) => {
    //   if (!data) {
    //     throw new HttpException('not found', HttpStatus.NOT_FOUND);
    //   }
    //   return { ...data, passWord: '' };
    // });
    return result;
  }
  async updateUser(body: any, id: number): Promise<user> {
    // const checkUser = await this.prisma.user.findUnique({
    //   where: { userID: id },
    // });

    // if (checkUser) {
    //   const { email: newEmail } = body;
    //   if (checkUser.email != newEmail && newEmail) {
    //     const checkEmail = await this.prisma.user.findFirst({
    //       where: { email: newEmail },
    //     });
    //     if (checkEmail) {
    //       throw new ConflictException(newEmail, 'email is already exists');
    //     }
    //   }
    //   const clientData = await this.prisma.user
    //     .update({
    //       where: { userID: id },
    //       data: body,
    //     })
    //     .then((data) => {
    //       return { ...data };
    //     })
    //     .catch(() => {
    //       throw new InternalServerErrorException();
    //     });

    //   return clientData;
    // }
    // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const clientData = await this.prisma.user.update({
      where: { userID: id },
      data: body,
    });
    // .then((data) => {
    //   return { ...data };
    // })
    // .catch(() => {
    //   throw new InternalServerErrorException();
    // });

    return clientData;
  }
  async deleteUser(id: string): Promise<user> {
    const result = await this.prisma.user.delete({
      where: { userID: Number(id) },
    });

    // .then(() => ({
    //   message: 'success',
    // }));
    // .catch(() => {
    //   throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    // });
    return result;
  }
  async searchUser(name: string): Promise<user[]> {
    const result = await this.prisma.user.findMany({ where: { name } });
    // .then((data) => {
    //   if (!data.length) {
    //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    //   }
    //   data.forEach((item) => {
    //     item.passWord = '';
    //   });
    //   return data;
    // });

    return result;
  }
  async uploadAvatar(
    id: number,
    url: string,
    fileName: string,
  ): Promise<resultUpload> {
    const fs = require('fs');
    const fullUrl = url + fileName;
    const link = process.cwd() + '/public/avatar/' + fileName;
    const checkUser = await this.prisma.user.findFirst({
      where: { userID: id },
    });
    if (checkUser) {
      let { avatar } = checkUser;
      const data = await this.prisma.user
        .update({
          where: { userID: id },
          data: { avatar: fullUrl },
        })
        .then((data) => {
          avatar = avatar.replace(url, '');
          const remove = process.cwd() + '/public/avatar/' + avatar;
          setTimeout(() => {
            fs.unlink(remove, () => null);
          }, 3000);
          return { avatar: fullUrl, message: 'success' };
        })
        .catch(() => {
          fs.unlinkSync(link);
          throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
        });
      return data;
    }
    fs.unlinkSync(link);
    throw new HttpException('not exist', null);
  }
  avatar(fileName: string, res: Response) {
    let url = `${process.cwd()}/public/avatar/${fileName}`;
    res.sendFile(url, (err) => {
      if (err) {
        res.status(404).send('Not found');
      } else {
        res.status(200).end();
      }
    });
  }
}
