import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { user } from '@prisma/client';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';
import { userLogin } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authSerivice: AuthService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/avatar',
        filename(req, file, callback) {
          let fileName = Date.now() + file.originalname;
          callback(null, fileName);
        },
      }),
    }),
  )
  @Post('/upload/:id')
  async upload(@UploadedFile() file, @Req() req) {
    const fs = require('fs');
    const Url = req.protocol + '://' + req.get('host') + '/auth/avatar/';
    const { id } = req.params;
    const fullUrl = Url + file.filename;
    const link = process.cwd() + '/public/avatar/' + file.filename;
    const data = await this.authSerivice.uploadAvatar(Number(id), fullUrl);

    if (data.result) {
      let { oldAvatar } = data;
      oldAvatar = oldAvatar.replace(Url, '');
      const remove = process.cwd() + '/public/avatar/' + oldAvatar;
      setTimeout(() => {
        fs.unlink(remove, () => null);
      }, 3000);
      return { avatar: fullUrl, message: 'success' };
    } else {
      fs.unlinkSync(link);
      throw new HttpException('Failed', HttpStatus.BAD_REQUEST);

    }
  }
  @Get('/user')
  getUser(): Promise<user[]> {
    return this.authSerivice.getUser();
  }
  @Post('/login')
  async login(@Body() body: userLogin): Promise<any> {
    const { email, passWord } = body;

    let check = await this.authSerivice.login(email, passWord);
    return check;
  }
  @Post('/sign')
  async signUp(@Body() body: user) {
    let message = await this.authSerivice.signUp(body);
    return message;
  }
  @Delete('/delete/:id')
  deleteUser() {}
}
