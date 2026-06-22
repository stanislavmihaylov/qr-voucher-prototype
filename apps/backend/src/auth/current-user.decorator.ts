import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: { user: unknown } = ctx
      .switchToHttp()
      .getRequest<{ user: unknown }>();
    return request.user;
  },
);
