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
import { room } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { decoratorConfig } from 'src/decorators/decorators';
import { createRoom, resultCreateRoom } from './dto';
import { RoomService } from './room.service';
@ApiTags('Room')
@Controller('api/room')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Get()
  @decoratorConfig(null, 'get data all room', 'success', resultCreateRoom, 200)
  getData(): Promise<room[]> {
    return this.roomService.getData();
  }
  @Post()
  @decoratorConfig('jwt', 'create room', 'success', resultCreateRoom, 201)
  createRoom(@Body() body: createRoom): Promise<room> {
    return this.roomService.createRoom(body);
  }
  @Get('/:id')
  @decoratorConfig(
    null,
    'get data room by ID',
    'success',
    resultCreateRoom,
    200,
  )
  getDataByID(@Param('id') id: string): Promise<room> {
    return this.roomService.getDataByID(Number(id));
  }
  @Delete('/:id')
  @decoratorConfig('admin', 'delete room by ID (token by admin)', 'success', resultCreateRoom, 201)
  deleteRoom(@Param('id') id: string): Promise<room> {
    return this.roomService.deleteRoom(Number(id));
  }
  @Put('/:id')
  @decoratorConfig(
    'jwt',
    'update data room by ID',
    'success',
    resultCreateRoom,
    200,
  )
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  updateRoom(@Param('id') id: string, @Body() body): Promise<room> {
    return this.roomService.updateRoom(Number(id), body);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/imgRoom',
        filename(req, file, callback) {
          let fileName = Date.now() + file.originalname;
          callback(null, fileName);
        },
      }),
    }),
  )
  @Post('/image-room/:id')
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
  ) {
    const Url =
      req.protocol + '://' + req.get('host') + '/api/room/image-room/';
    const fileName: string = file.filename;
    return this.roomService.uploadImage(Number(id), Url, fileName);
  }

  @Get('/image-room/:fileName')
  @ApiExcludeEndpoint()
  showImg(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.roomService.imageRoom(fileName, res);
  }
}
