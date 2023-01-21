import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { RoleStrategy } from 'src/strategy/role.strategy';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CommentController],
  providers: [CommentService, JwtStrategy, RoleStrategy],
})
export class CommentModule {}
