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
import { ApiTags } from '@nestjs/swagger';
import { position } from '@prisma/client';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { PositionService } from './position.service';
@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(private positionService: PositionService) {}
  @Get()
  getData(): Promise<position[]> {
    return this.positionService.getData();
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/position',
        filename(req, file, callback) {
          let fileName = Date.now() + file.originalname;
          callback(null, fileName);
        },
      }),
    }),
  )
  @Post('/image/:id')
  upload(@UploadedFile() file, @Param('id') id: string, @Req() req) {
    const url = req.protocol + '://' + req.get('host') + '/position/image/';
    const fileName: string = file.filename;
    return this.positionService.uploadImage(Number(id), url, fileName);
  }
  @Post()
  create(@Body() data: position) {
    return this.positionService.createPostion(data);
  }
  @Get('/image/:fileName')
  viewImage(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.positionService.viewImage(fileName, res);
  }
  @Get('info')
  search(@Query() search) {
    return this.positionService.searchInfo(search);
  }
}
