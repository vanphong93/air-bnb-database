import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function decoratorConfig(token, sum, des, resData, status) {
  let result;
  if (status === 200) {
    result = ApiOkResponse({ description: des, type: resData });
  }
  if (status === 201) {
    result = ApiCreatedResponse({ description: des, type: resData });
  }
  if (token) {
    return applyDecorators(
      ApiBearerAuth(),
      UseGuards(AuthGuard(`${token}`)),
      ApiOperation({ summary: `${sum}` }),
      result,
    );
  }
  return applyDecorators(ApiOperation({ summary: `${sum}` }), result);
}
