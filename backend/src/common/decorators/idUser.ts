import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const IdUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.idUser;
});
