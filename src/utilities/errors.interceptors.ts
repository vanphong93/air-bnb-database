import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === null) {
          return { ...data, message: 'Data not found' };
        }
        return data;
      }),
      catchError((err) => {
        console.log('failed ', err);
        if (err.message.includes('Data upload wrong')) {
          throw new HttpException('Data upload wrong', HttpStatus.BAD_REQUEST);
        }
        if (err.message.includes('not exist')) {
          throw new HttpException('Data not exist', HttpStatus.NOT_FOUND);
        }
        if (err.message.includes('Unknown arg')) {
          throw new HttpException('Data wrong', HttpStatus.BAD_REQUEST);
        }
        if (err.message.includes('Got invalid value')) {
          throw new HttpException('Type data wrong', HttpStatus.BAD_REQUEST);
        }
        if (
          err.message.includes(
            'Please make sure your database server is running',
          )
        ) {
          throw new HttpException(
            'Server is not working',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        if (err.code === 'P2002') {
          let data = err.meta.target;
          throw new HttpException(`${data} is exist`, HttpStatus.BAD_REQUEST);
        }
        return next.handle();
      }),
    );
  }
}
