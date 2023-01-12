import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PositionController],
  providers: [PositionService, JwtStrategy],
})
export class PositionModule {}
