import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { comment, PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  private prisma: PrismaClient = new PrismaClient();
  async getData(): Promise<comment[]> {
    const result = await this.prisma.comment.findMany();
    return result;
  }
  async createComment(body):Promise<comment> {
    const result = await this.prisma.comment.create({
      data: body,
    });
    return result;
  }
  async getDataByID(id: number): Promise<comment[]> {
    const result = await this.prisma.comment.findMany({
      where: { hostID: id },
    });
    return result;
  }
  async deleteComment(id: number): Promise<comment> {
    const result = await this.prisma.comment.delete({
      where: { commentID: id },
    });
    return result;
  }
}
