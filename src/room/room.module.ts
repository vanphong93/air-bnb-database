import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [RoomController],
  providers: [RoomService, JwtStrategy],
})
export class RoomModule {}
