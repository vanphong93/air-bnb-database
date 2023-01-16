import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiHideProperty,
  ApiOAuth2,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { bedRoom, imageRoom, room } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { dataRequire, mimetypeImage } from 'src/utilities/validation';
import { createBedRoom } from './dto';
import { RoomService } from './room.service';
@ApiTags('Room')
@Controller('api/room')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Get()
  @ApiOperation({ summary: 'Get data all room' })
  getData(): Promise<room[]> {
    return this.roomService.getAllRoom();
  }
  @Post()
  @ApiOperation({ summary: 'Craete room' })
  createRoom(@Body() body: room): Promise<room> {
    return this.roomService.createRoom(body);
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Get data room by room ID' })
  getDataByID(@Param('id') id: string): Promise<room> {
    return this.roomService.getDataByID(Number(id));
  }
  // @Get('/image/all')
  // getDataImg(): Promise<imageRoom[]> {
  //   return this.roomService.allImageRoom();
  // }
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 3 }], {
      storage: diskStorage({
        destination: './public/img',
        filename(req, file, callback) {
          let fileName = Date.now() + file.originalname;
          callback(null, fileName);
        },
      }),
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
  @ApiOperation({ summary: 'Create image room' })
  upload(@UploadedFiles() data, @Req() req: Request, @Param('id') id: string) {
    const Url = req.protocol + '://' + req.get('host') + '/api/room/image/';
    return this.roomService.uploadImage(Number(id), Url, data);
  }
  @Delete('/image/:id')
  @ApiOperation({ summary: 'Delete image room' })
  deleteImgRoom(
    @Param('id') id: string,
    @Req() req,
  ): Promise<{
    message: string;
  }> {
    let splitURL = req.protocol + '://' + req.get('host') + '/api/room/image/';
    return this.roomService.deleteImg(Number(id), splitURL);
  }
  @Get('/image/:fileName')
  // @ApiExcludeEndpoint()
  showImg(@Param('fileName') fileName: string, @Res() res:Response) {
    return this.roomService.imageRoom(fileName, res);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10487560 },
      storage: diskStorage({
        destination: './public/bedRoom',
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
  @Post('/bed-room')
  createBedRoom(@Body() body: createBedRoom): Promise<createBedRoom> {
    return this.roomService.createBedRoom(body);
  }
}
