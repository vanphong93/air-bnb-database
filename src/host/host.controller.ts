import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { host, imageHost, room } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';

import { decoratorConfig } from 'src/decorators/decorators';
import { mimetypeImage } from 'src/utilities/validation';

import {
  createHost,
  FilesUploadDto,
  resultData,
  resultImage,
  resultPost,
} from './dto';

import { HostService } from './host.service';
@ApiTags('Host')
@Controller('api/host')
export class HostController {
  constructor(private hostService: HostService) {}
  @Get()
  @decoratorConfig(null, 'get data all host', 'success', [resultData], 200)
  getData(): Promise<resultData[]> {
    return this.hostService.getData();
  }
  @Post()
  @decoratorConfig(null, 'create host', 'success', resultPost, 201)
  createHost(@Body() body: createHost): Promise<resultPost> {
    return this.hostService.createHost(body);
  }
  @Get('/:id')
  @decoratorConfig(null, 'get data host by id', 'success', resultData, 200)
  getDataById(@Param('id') id: string): Promise<resultData> {
    return this.hostService.getDataById(Number(id));
  }
  @Put('/:id')
  @decoratorConfig('jwt', 'update host by id', 'success', resultPost, 201)
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  updateHost(@Param('id') id: string, @Body() body: any): Promise<host> {
    return this.hostService.updateHost(Number(id), body);
  }
  @Delete('/:id')
  @decoratorConfig('admin', 'delete host by id (token by admin)', 'success', resultPost, 200)
  deleteHost(@Param('id') id: string): Promise<resultPost> {
    return this.hostService.deleteHost(Number(id));
  }
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 3 }], {
      limits: { fileSize: 10487560 },
      storage: diskStorage({
        destination: './public/imgHost',
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
  @Post('/image-host/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of image (max 3 file)',
    type: FilesUploadDto,
  })
  @decoratorConfig(null, 'create image host', 'success', [resultImage], 201)
  upload(
    @UploadedFiles() file,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<imageHost[]> {
    const Url =
      req.protocol + '://' + req.get('host') + '/api/host/image-host/';
    return this.hostService.uploadImage(Number(id), Url, file);
  }
  @decoratorConfig('jwt', 'delete image host', 'success', null, 200)
  @Delete('/image-host/:id')
  deleteImage(
    @Param('id') id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    let splitURL =
      req.protocol + '://' + req.get('host') + '/api/host/image-host/';
    return this.hostService.deleteImage(Number(id), splitURL);
  }
  @Get('/image-host/:fileName')
  @ApiExcludeEndpoint()
  showImg(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.hostService.showImg(fileName, res);
  }
}
