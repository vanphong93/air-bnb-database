import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { position } from '@prisma/client';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { decoratorConfig } from 'src/decorators/decorators';
import { resultData } from 'src/host/dto';
import { mimetypeImage } from 'src/utilities/validation';
import { createPosition, resultPostion } from './dto';
import { PositionService } from './position.service';
@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(private positionService: PositionService) {}
  @Get()
  @decoratorConfig(null, 'get data position', 'success', resultPostion, 200)
  getData(): Promise<position[]> {
    return this.positionService.getData();
  }
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10487560 },
      storage: diskStorage({
        destination: './public/position',
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
  @Post('/image/:id')
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
  @decoratorConfig(null, 'upload image position', 'success', null, 201)
  upload(@UploadedFile() file, @Param('id') id: string, @Req() req) {
    const url = req.protocol + '://' + req.get('host') + '/position/image/';
    const fileName: string = file.filename;
    return this.positionService.uploadImage(Number(id), url, fileName);
  }
  @Post()
  @decoratorConfig(null, 'create  position', 'success', resultPostion, 201)
  create(@Body() data: createPosition): Promise<position> {
    return this.positionService.createPostion(data);
  }
  @ApiExcludeEndpoint()
  @Get('/image/:fileName')
  viewImage(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.positionService.viewImage(fileName, res);
  }
  @Get('info')
  @ApiQuery({
    type: 'string',
    name: 'location',
    description: 'City name ',example:'ha noi'
  })
  @decoratorConfig(null, 'search position', 'success', null, 200)
  search(@Query() search) {
    return this.positionService.searchInfo(search);
  }
}
