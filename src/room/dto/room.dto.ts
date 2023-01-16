import { ApiProperty } from '@nestjs/swagger';

export class createBedRoom {
  bedID: number;
  @ApiProperty()
  roomID: number;
  @ApiProperty({ required: false })
  imageBed: string | null;
  @ApiProperty()
  guest: number;
  @ApiProperty()
  bed: number;
  @ApiProperty()
  price: number;
}
