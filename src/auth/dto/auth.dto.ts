import { ApiConsumes, ApiProperty, ApiQuery } from '@nestjs/swagger';

export class userLogin {
  @ApiProperty({ example: 'phongckm93@gmail.com' })
  email: string;
  @ApiProperty({ example: '1234' })
  passWord: string;
}
export class userSign {
  userID: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  passWord: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ required: false })
  phone: number | null;
  @ApiProperty({ required: false })
  birthDate: Date | null;
  @ApiProperty({ required: false })
  gender: boolean | null;
  @ApiProperty({ required: false })
  role: boolean | null;
  @ApiProperty({ required: false })
  avatar: string | null;
}

export class resultLogin {
  token: string;
  userID: number;
  name: string;
  email: string;
  phone: number;
  birthDate: Date;
  gender: boolean;
  role: boolean;
  avatar: string;
}
export type token = { token: string };
export type resultUpload = { message: string; avatar: string };



