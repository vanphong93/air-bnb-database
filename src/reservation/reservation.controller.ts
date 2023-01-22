import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { reservation } from '@prisma/client';
import { decoratorConfig } from 'src/decorators/decorators';
import { createReser, resultReservation } from './dto';
import { ReservationService } from './reservation.service';
@ApiTags('Reservation')
@Controller('api/reservation')
export class ReservationController {
  constructor(private reserService: ReservationService) {}
  @Get()
  @decoratorConfig('jwt', 'get data', 'success', [resultReservation], 200)
  getData() {
    return this.reserService.getData();
  }
  @Post()
  @decoratorConfig(
    'jwt',
    'create reservation',
    'success',
    resultReservation,
    201,
  )
  createSer(@Body() body: createReser): Promise<reservation> {
    return this.reserService.createSer(body);
  }
  @Delete('/:id')
  @decoratorConfig('jwt', 'get data', 'success', resultReservation, 200)
  deleteSer(@Param('id') id: string): Promise<reservation> {
    return this.reserService.deleteSer(Number(id));
  }
  @Put('/:id')
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  @decoratorConfig('jwt', 'update reservation', 'success', resultReservation, 200)
  updateSer(@Param('id') id: string, @Body() body) {
    return this.reserService.updateSer(Number(id), body);
  }
}
