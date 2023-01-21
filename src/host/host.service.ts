import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { host, imageHost, PrismaClient, room } from '@prisma/client';
import { Response } from 'express';

import { dataRequire, hostProperty } from 'src/utilities/validation';
import { createHost, resultData, resultPost } from './dto';

@Injectable()
export class HostService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getData(): Promise<resultData[]> {
    const result = await this.prisma.host.findMany({
      include: {
        room: true,
        imageHost: true,
        comment: true,
      },
    });

    return result;
  }
  async getDataById(id: number): Promise<resultData> {
    const result = await this.prisma.host.findFirst({
      where: { hostID: id },
      include: {
        room: true,
        imageHost: true,
        comment: true,
      },
    });
    return result;
  }
  async createHost(body: createHost): Promise<resultPost> {
    if (dataRequire(body, hostProperty)) {
      throw new HttpException('Not enough data', HttpStatus.BAD_REQUEST);
    }
    const result = await this.prisma.host.create({ data: body });
    return result;
  }
  async updateHost(id: number, body: any): Promise<host> {
    const result = await this.prisma.host.update({
      where: { hostID: id },
      data: body,
    });
    return result;
  }
  async deleteHost(id: number): Promise<resultPost> {
    const result = await this.prisma.host.delete({
      where: { hostID: id },
    });
    return result;
  }
  async uploadImage(id: number, url: string, data): Promise<imageHost[]> {
    const file = data.file;
    const result = [];
    const checkRoom = await this.prisma.host.findFirst({
      where: { hostID: id },
    });
    if (checkRoom) {
      for (let index = 0; index < file.length; index++) {
        const fileName = file[index].filename;
        const fullUrl = url + fileName;
        await this.prisma.imageHost
          .create({
            data: {
              hostID: id,
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
  async deleteImage(
    id: number,
    splitURL: string,
  ): Promise<{ message: string }> {
    const result = await this.prisma.imageHost
      .delete({
        where: { imageID: id },
      })
      .then((data) => {
        const fs = require('fs');
        let { url } = data;
        url = url.replace(splitURL, '');
        const remove = process.cwd() + '/public/img/' + url;
        setTimeout(() => {
          fs.unlink(remove, (err) => {
            return;
          });
        }, 3000);
        return {
          message: 'success',
        };
      });
    return result;
  }
  showImg(fileName: string, res: Response) {
    let url = `${process.cwd()}/public/img/${fileName}`;
    res.sendFile(url, (err) => {
      if (err) {
        res.status(404).send('Not found');
      } else {
        res.status(200).end();
      }
    });
  }
}
