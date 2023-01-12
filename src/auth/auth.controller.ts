import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { user } from '@prisma/client';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';
import { resultUpload, token, userLogin } from './dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  getUser(): Promise<user[]> {
    return this.authService.getUser();
  }
  @Post('/user')
  login(@Body() body: userLogin): Promise<user & token> {
    const { email, passWord } = body;
    return this.authService.login(email, passWord);
  }
  @Post('/sign')
  signUp(@Body() body: user): Promise<user> {
    return this.authService.signUp(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  getUserById(@Param('id') id: string): Promise<user> {
    return this.authService.getUserById(Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/user/:id')
  update(@Body() body: user, @Param('id') id: string): Promise<user> {
    return this.authService.updateUser(body, Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/user/:id')
  deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.authService.deleteUser(id);
  }
  @Post('/search')
  searchUser(@Query() data) {
    return this.authService.searchUser(data);
  }
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
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload/:id')
  upload(
    @UploadedFile() file,
    @Req() req,
    @Param('id') id: string,
  ): Promise<resultUpload> {
    const Url = req.protocol + '://' + req.get('host') + '/auth/avatar/';
    const fileName: string = file.filename;
    return this.authService.uploadAvatar(Number(id), Url, fileName);
  }
  @Get('/avatar/:fileName')
  showAvatar(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.authService.avatar(fileName, res);
  }
}
