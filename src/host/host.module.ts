import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { HostController } from './host.controller';
import { HostService } from './host.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [HostController],
  providers: [HostService, JwtStrategy],
})
export class HostModule {}
