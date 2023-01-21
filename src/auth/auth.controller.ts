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
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { user } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { NotFoundError } from 'rxjs';
import { decoratorConfig } from 'src/decorators/decorators';
import {
  dataRequire,
  loginProperty,
  mimetypeImage,
  signProperty,
} from 'src/utilities/validation';
import { AuthService } from './auth.service';
import {
  resultLogin,
  resultSign,
  resultUpload,
  userLogin,
  userSign,
} from './dto';

@ApiTags('User')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/user')
  @decoratorConfig('jwt', 'Get data all user (Admin)', 'Success', [resultSign],200)
  getUser(): Promise<user[]> {
    return this.authService.getUser();
  }
  @Post('/login')
  @decoratorConfig(null, 'User login', 'Success', resultLogin,201)
  login(@Body() body: userLogin): Promise<resultLogin> {
    if (dataRequire(body, loginProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(body);
  }
  @Post('/sign')
  @decoratorConfig(null, 'User sign up', 'Success', resultSign,201)
  signUp(@Body() body: userSign): Promise<user> {
    if (dataRequire(body, signProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.signUp(body);
  }

  @Get('/user/:id')
  @decoratorConfig('jwt', 'Get data user by id', 'Success', resultSign,200)
  getUserById(@Param('id') id: string): Promise<user> {
    return this.authService.getUserById(Number(id));
  }

  @Put('/user/:id')
  @decoratorConfig('jwt', 'Update user by ID', 'Success', resultSign,201)
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  update(@Body() body: any, @Param('id') id: string): Promise<user> {
    return this.authService.updateUser(body, Number(id));
  }
  @Delete('/user/:id')
  @decoratorConfig('jwt', 'Delete user by ID', 'Success', resultSign,200)
  deleteUser(@Param('id') id: string): Promise<user> {
    return this.authService.deleteUser(id);
  }
  @Get('/search')
  @decoratorConfig('jwt', 'Search user', 'Success', resultSign,201)
  searchUser(@Query('name') name: string): Promise<user[]> {
    return this.authService.searchUser(name);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10487560 },
      storage: diskStorage({
        destination: './public/avatar',
        filename(req, file, callback) {
          console.log('file: ', file);
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
  @Post('/upload/:id')
  @decoratorConfig('jwt', 'Upload avatar user', 'Success', resultUpload,201)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<resultUpload> {
    if (!file) {
      throw new Error('Data upload wrong');
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
