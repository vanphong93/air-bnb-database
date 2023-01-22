import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, reservation } from '@prisma/client';
import { createReser } from './dto';

@Injectable()
export class ReservationService {
  constructor(private config: ConfigService, jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getData(): Promise<reservation[]> {
    const result = await this.prisma.reservation.findMany();
    return result;
  }
  async createSer(body: createReser): Promise<reservation> {
    const result = await this.prisma.reservation.create({ data: body });
    return result;
  }
  async deleteSer(id: number): Promise<reservation> {
    const result = await this.prisma.reservation.delete({
      where: { reserID: id },
    });
    return result;
  }
  async updateSer(id, body) {
    const result = await this.prisma.reservation.update({
      where: { reserID: id },
      data: body,
    });
    return result;
  }
}
