import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { position, PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { toLowerCaseNonAccentVietnamese } from 'src/utilities/coverString';
import { locationVN } from 'src/utilities/dataLocation';
import { createPosition } from './dto';

@Injectable()
export class PositionService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getData(): Promise<position[]> {
    const result = await this.prisma.position.findMany();
    return result;
  }
  async createPostion(data: createPosition): Promise<position> {
    const result = await this.prisma.position.create({ data });
    return result;
  }
  async uploadImage(id: number, url, fileName) {
    const fs = require('fs');
    const fullUrl = url + fileName;
    const link = process.cwd() + '/public/position/' + fileName;
    const checkPosition = await this.prisma.position.findFirst({
      where: { positionID: id },
    });
    if (checkPosition) {
      let { image } = checkPosition;
      const data = await this.prisma.position
        .update({
          where: { positionID: id },
          data: { image: fullUrl },
        })
        .then((data) => {
          image = image.replace(url, '');
          const remove = process.cwd() + '/public/position/' + image;
          setTimeout(() => {
            fs.unlink(remove, () => null);
          }, 3000);
          return { image: fullUrl, message: 'success' };
        })
        .catch(() => {
          fs.unlinkSync(link);
          throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
        });
      return data;
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
  viewImage(fileName: string, res: Response) {
    let url = `${process.cwd()}/public/position/${fileName}`;
    res.sendFile(url, (err) => {
      if (err) {
        res.status(404).send('Not found');
      } else {
        res.status(200).end();
      }
    });
  }
  searchInfo(search) {
    let { location } = search;

    const result = locationVN.filter((item) => {
      return (
        toLowerCaseNonAccentVietnamese(item.city) ===
        toLowerCaseNonAccentVietnamese(location)
      );
    });
    return result;
  }
}
