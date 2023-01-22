import { ApiProperty } from '@nestjs/swagger';
import { imageHost, room } from '@prisma/client';
export class createReser {
  @ApiProperty()
  startDay: Date;
  @ApiProperty()
  endDay: Date;
  @ApiProperty()
  guest: number;
  @ApiProperty()
  roomID: number;
  @ApiProperty()
  userID: number;
}
export class resultReservation extends createReser {
  @ApiProperty()
  reserID: number;
}
