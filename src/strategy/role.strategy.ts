import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class RoleStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('SECRET_KEY'),
    });
  }
  async validate(payload: any) {
    if (!payload.role) {
      throw new UnauthorizedException('Permission denied');
    }
    return payload;
  }
}
