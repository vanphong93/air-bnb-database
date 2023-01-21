import { ApiProperty } from '@nestjs/swagger';

export class createPosition {
  @ApiProperty()
  name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  country: string;
}
export class resultPostion extends createPosition {
  @ApiProperty({ required: false })
  positionID: number;
  @ApiProperty({ required: false })
  lng: number;
  @ApiProperty({ required: false })
  lat: number;
  @ApiProperty({ required: false })
  image: string;
}
