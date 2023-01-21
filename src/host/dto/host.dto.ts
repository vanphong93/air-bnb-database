import { ApiProperty } from '@nestjs/swagger';
import { comment, imageHost, room } from '@prisma/client';

export class createHost {
  @ApiProperty()
  address: string;
  @ApiProperty()
  hostName: string;
  @ApiProperty()
  phone: number;
  @ApiProperty()
  bath: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  positionID: number;
}
export class resultPost extends createHost {
  @ApiProperty()
  hostID: number;
  @ApiProperty({ required: false })
  air: boolean | null;
  @ApiProperty({ required: false })
  iron: boolean | null;
  @ApiProperty({ required: false })
  tv: boolean | null;
  @ApiProperty({ required: false })
  wifi: boolean | null;
  @ApiProperty({ required: false })
  kitchen: boolean | null;
  @ApiProperty({ required: false })
  park: boolean | null;
  @ApiProperty({ required: false })
  coffe: boolean | null;
  @ApiProperty({ required: false })
  refrigerator: boolean | null;
  @ApiProperty({ required: false })
  lng: number | null;
  @ApiProperty({ required: false })
  lat: number | null;
}
export class resultData extends resultPost {
  @ApiProperty({ required: false })
  room: Array<room>;
  @ApiProperty({ required: false })
  imageHost: Array<imageHost>;
  @ApiProperty({ required: false })
  comment: Array<comment>;
}

export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  file: any[];
}
export class resultImage {
  @ApiProperty()
  imageID: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  hostID: number;
}
