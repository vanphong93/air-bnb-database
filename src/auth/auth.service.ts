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
import { userLogin } from './dto';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  getHello(): string {
    return 'Hello World!';
  }
  async getUser(): Promise<user[]> {
    return await this.prisma.user.findMany();
  }
  async login(email: string, passWord: string): Promise<any> {
    const checkUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (checkUser) {
      if (checkUser.passWord === passWord) {
        let token = this.jwt.sign(checkUser, {
          expiresIn: '2d',
          secret: this.config.get('SECRET_KEY'),
        });
        let { passWord, ...clientData } = checkUser;
        return { ...clientData, token };
      }
      throw new HttpException('Pass wrong', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('Email is not found', HttpStatus.NOT_FOUND);
  }
  async uploadAvatar(id: number, url: string): Promise<any> {
    const checkUser = await this.prisma.user.findFirst({
      where: { userID: id },
    });
    if (checkUser) {
      let { avatar } = checkUser;
      const data = await this.prisma.user
        .update({
          where: { userID: id },
          data: { avatar: url },
        })
        .then((data) => {
          return { ...data, oldAvatar: avatar, result: true };
        })
        .catch(() => {
          return { result: false };
        });

      return data;
    }
    return { result: false };
  }
  async signUp(body) {
    let { email } = body;
    let checkEmail = await this.prisma.user.findFirst({ where: { email } });
    if (checkEmail) {
      throw new ConflictException(email, 'email is already exists');
    }
    let clientData = await this.prisma.user
      .create({ data: body })
      .then((data) => {
        return { ...data };
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return clientData;
  }
}
