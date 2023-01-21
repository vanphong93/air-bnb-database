import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, room } from '@prisma/client';
import { Response } from 'express';
import {
  checkEmpty,
  dataRequire,
  roomProperty,
} from 'src/utilities/validation';
import { createRoom } from './dto';
// import { createBedRoom } from './dto';

@Injectable()
export class RoomService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getData(): Promise<room[]> {
    const result = await this.prisma.room.findMany();
    return result;
  }
  async getDataByID(id: number): Promise<room> {
    const result = await this.prisma.room.findFirst({
      where: { roomID: id },
    });

    return result;
  }
  async deleteRoom(id: number): Promise<room> {
    const result = await this.prisma.room.delete({
      where: { roomID: id },
    });

    return result;
  }
  async updateRoom(id: number, body): Promise<room> {
    const result = await this.prisma.room.update({
      where: { roomID: id },
      data: body,
    });

    return result;
  }
  async createRoom(body: createRoom): Promise<room> {
    if (dataRequire(body, roomProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    const result = await this.prisma.room.create({ data: body });
    return result;
  }
  async uploadImage(id: number, url: string, fileName: string) {
    const fs = require('fs');
    const fullUrl = url + fileName;
    const link = process.cwd() + '/public/imgRoom/' + fileName;
    const checkRoom = await this.prisma.room.findFirst({
      where: { roomID: id },
    });
    if (checkRoom) {
      let { imageRoom } = checkRoom;
      const data = await this.prisma.room
        .update({
          where: { roomID: id },
          data: { imageRoom: fullUrl },
        })
        .then((data) => {
          imageRoom = imageRoom.replace(url, '');
          const remove = process.cwd() + '/public/imgRoom/' + imageRoom;
          setTimeout(() => {
            fs.unlink(remove, () => null);
          }, 3000);
          return data;
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
  
  imageRoom(fileName: string, res: Response) {
    let url = `${process.cwd()}/public/imgRoom/${fileName}`;
    res.sendFile(url, (err) => {
      if (err) {
        res.status(404).send('Not found');
      } else {
        res.status(200).end();
      }
    });
  }

}
