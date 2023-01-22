import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  prisma: PrismaClient = new PrismaClient();
  getHello(): string {
    return 'Hello World!';
  }

}
