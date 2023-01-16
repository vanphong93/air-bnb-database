import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { imageRoom, PrismaClient, room } from '@prisma/client';
import { Response } from 'express';
import {
  checkEmpty,
  dataRequire,
  roomProperty,
} from 'src/utilities/validation';
import { createBedRoom } from './dto';

@Injectable()
export class RoomService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getAllRoom(): Promise<room[]> {
    const result = await this.prisma.room.findMany({
      include: {
        imageRoom: { select: { url: true, imageID: true } },
        bedRoom: {
          select: { bedID: true, imageBed: true, guest: true, bed: true },
        },
      },
    });
    return result;
  }
  async getDataByID(id: number): Promise<room> {
    const result = await this.prisma.room
      .findFirst({
        where: { roomID: id },
        include: { imageRoom: { select: { url: true } }, bedRoom: true },
      })
      .then((data) => {
        if (!data) {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return { ...data };
      });
    return result;
  }
  async createRoom(body: room): Promise<room> {
    if (dataRequire(body, roomProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    const result = await this.prisma.room.create({ data: body });
    return result;
  }
  async uploadImage(id: number, url: string, data) {
    const file = data.file;
    const result = [];
    const checkRoom = await this.prisma.room.findFirst({
      where: { roomID: id },
    });
    if (checkRoom) {
      for (let index = 0; index < file.length; index++) {
        const fileName = file[index].filename;
        const fullUrl = url + fileName;
        await this.prisma.imageRoom
          .create({
            data: {
              roomID: id,
              url: fullUrl,
            },
          })
          .then((data) => {
            result.push(data);
          });
      }
    }
    return result;
  }
  async deleteImg(
    id: number,
    splitURL: string,
  ): Promise<{
    message: string;
  }> {
    const fs = require('fs');
    const result = await this.prisma.imageRoom
      .delete({
        where: { imageID: id },
      })
      .then((data) => {
        let { url: URL } = data;
        URL = URL.replace(splitURL, '');
        setTimeout(() => {
          fs.unlink(process.cwd() + '/public/img/' + URL, (err) => {
            return;
          });
        }, 3000);
        return {
          message: 'success',
        };
      })
      .catch(() => {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      });
    return result;
  }
  // async allImageRoom(): Promise<imageRoom[]> {
  //   const result = await this.prisma.imageRoom.findMany();
  //   return result;
  // }
  imageRoom(fileName: string, res: Response) {
    let url = `${process.cwd()}/public/img/${fileName}`;
    res.sendFile(url, (err) => {
      if (err) {
        res.status(404).send('Not found');
      } else {
        res.status(200).end();
      }
    });
  }
  async createBedRoom(body: createBedRoom): Promise<createBedRoom> {
    const reuslt = await this.prisma.bedRoom.create({
      data: { ...body },
    });

    return reuslt;
  }
}
