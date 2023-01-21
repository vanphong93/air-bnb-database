import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

export class createRoom {
  // roomID: number
  @ApiProperty()
  nameRoom: string;
  @ApiProperty()
  imageRoom: string;
  @ApiProperty()
  guest: number;
  @ApiProperty()
  bed: number;
  @ApiProperty()
  price: number;
  @ApiProperty()
  hostID: number;
}
export class resultCreateRoom extends createRoom {
  @ApiProperty()
  roomID: number;
}
