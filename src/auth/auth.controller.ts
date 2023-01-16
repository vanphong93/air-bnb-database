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
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { user } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import {
  dataRequire,
  loginProperty,
  mimetypeImage,
  signProperty,
} from 'src/utilities/validation';
import { AuthService } from './auth.service';
import { resultUpload, token, userLogin, userSign } from './dto';
@ApiTags('User')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get data all user (Admin)' })
  getUser(): Promise<user[]> {
    return this.authService.getUser();
  }
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  login(@Body() body: userLogin): Promise<user & token> {
    if (dataRequire(body, loginProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(body);
  }
  @Post('/sign')
  @ApiOperation({ summary: 'User sign up' })
  signUp(@Body() body: userSign): Promise<user> {
    if (dataRequire(body, signProperty)) {
      throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
    }
    return this.authService.signUp(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get data user by id' })
  getUserById(@Param('id') id: string): Promise<user> {
    return this.authService.getUserById(Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  update(@Body() body: user, @Param('id') id: string): Promise<user> {
    return this.authService.updateUser(body, Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.authService.deleteUser(id);
  }
  @Get('/search')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search user' })
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
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar user' })
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
