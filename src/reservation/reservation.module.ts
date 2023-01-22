import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { RoleStrategy } from 'src/strategy/role.strategy';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  providers: [ReservationService, JwtStrategy, RoleStrategy],
  controllers: [ReservationController],
  imports: [JwtModule.register({})],
})
export class ReservationModule {}
