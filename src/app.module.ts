import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, RoomModule, PositionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
