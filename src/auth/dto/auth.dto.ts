import {

  ApiProperty,

} from '@nestjs/swagger';

export class userLogin {
  @ApiProperty({ example: 'phongckm93@gmail.com' })
  email: string;
  @ApiProperty({ example: '1234' })
  passWord: string;
}
export class userSign {
  @ApiProperty()
  name: string;
  @ApiProperty()
  passWord: string;
  @ApiProperty()
  email: string;
}
export class resultSign extends userSign {
  @ApiProperty({ required: false })
  userID: number;
  @ApiProperty({ required: false })
  phone: number | null;
  @ApiProperty({ required: false })
  birthDate: Date | null;
  @ApiProperty({ required: false })
  gender: boolean | null;
  @ApiProperty({ required: false, example: false })
  role: boolean | null;
  @ApiProperty({ required: false })
  avatar: string | null;
}
export class resultLogin {
  @ApiProperty({ required: false })
  userID: number;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  email: string;
  @ApiProperty()
  passWord: string;
  @ApiProperty({ required: false })
  phone: number;
  @ApiProperty({ required: false })
  birthDate: Date;
  @ApiProperty({ required: false })
  gender: boolean;
  @ApiProperty({ required: false })
  role: boolean;
  @ApiProperty({ required: false })
  avatar: string;
  @ApiProperty({ required: false })
  token: string;
}

export class resultUpload {
  @ApiProperty({ required: false })
  message: string;
  @ApiProperty({ required: false })
  avatar: string;
}
