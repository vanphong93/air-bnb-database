import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { user } from '@prisma/client';
import { Response } from 'express';
import { diskStorage } from 'multer';
import {
  dataRequire,
  loginProperty,
  mimetypeImage,
  signProperty,
} from 'src/utilities/validation';
import { AuthService } from './auth.service';
import { resultUpload, token, userLogin } from './dto';
@ApiTags('User')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  @ApiBearerAuth()
  getUser(): Promise<user[]> {
    return this.authService.getUser();
  }
  @Post('/login')
  login(@Body() body: userLogin): Promise<user & token> {
    if (dataRequire(body, loginProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(body);
  }
  @Post('/sign')
  signUp(@Body() body: user): Promise<user> {
    if (dataRequire(body, signProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.signUp(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  @ApiBearerAuth()
  getUserById(@Param('id') id: string): Promise<user> {
    return this.authService.getUserById(Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/user/:id')
  @ApiBearerAuth()
  update(@Body() body: user, @Param('id') id: string): Promise<user> {
    return this.authService.updateUser(body, Number(id));
  }
  @UseGuards(AuthGuard('admin'))
  @Delete('/user/:id')
  @ApiBearerAuth()
  deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.authService.deleteUser(id);
  }
  @Post('/search')
  @ApiBearerAuth()
  searchUser(@Query() data) {
    return this.authService.searchUser(data);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 8000 },
      storage: diskStorage({
        destination: './public/avatar',
        filename(req, file, callback) {
          let fileName = Date.now() + file.originalname;
          callback(null, fileName);
        },
      }),
      fileFilter(req, file, callback) {
        if (!mimetypeImage.includes(file.mimetype)) {
          callback(null, false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload/:id')
  @ApiBearerAuth()
  upload(
    @UploadedFile() file,
    @Req() req,
    @Param('id') id: string,
  ): Promise<resultUpload> {
    if (!file) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    const url = req.protocol + '://' + req.get('host') + '/api/auth/avatar/';
    const fileName: string = file.filename;
    return this.authService.uploadAvatar(Number(id), url, fileName);
  }
  @Get('/avatar/:fileName')
  @ApiExcludeEndpoint()
  showAvatar(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.authService.avatar(fileName, res);
  }
}
