import {
  Body,
  Controller,
  Delete,
  Get,
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
import { room } from '@prisma/client';
import { diskStorage } from 'multer';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}
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
  @Post('/upload/:id')
  upload(@UploadedFiles() data, @Req() req, @Param('id') id: string) {
    const Url = req.protocol + '://' + req.get('host') + '/room/image/';
    return this.roomService.uploadImage(Number(id), Url, data);
  }
  @Get()
  getData(): Promise<room[]> {
    return this.roomService.getAllRoom();
  }
  @Get('/:id')
  getDataByID(@Param('id') id: string) {
    return this.roomService.getDataByID(Number(id));
  }
  @Post()
  createRoom(@Body() body: room): Promise<room> {
    return this.roomService.createRoom(body);
  }

  @Delete('/image/:id')
  deleteImgRoom(@Param('id') id: string, @Req() req) {
    let splitURL = req.protocol + '://' + req.get('host') + '/room/img/';
    return this.roomService.deleteImg(Number(id), splitURL);
  }
  @Get('/image/:fileName')
  showImg(@Param('fileName') fileName: string, @Res() res) {
    return this.roomService.imageRoom(fileName, res);
  }
}
