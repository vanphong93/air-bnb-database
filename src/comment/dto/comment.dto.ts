import { ApiProperty } from '@nestjs/swagger';
import { imageHost, room } from '@prisma/client';
export class createComment {
  @ApiProperty()
  userID: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  hostID: number;
}
export class dataComment extends createComment {
  @ApiProperty({ required: false })
  commentID: number;
  @ApiProperty({ required: false })
  dateCreated: Date | null;
  @ApiProperty({ required: false })
  rate: number | null;
}
