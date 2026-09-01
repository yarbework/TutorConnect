import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUserPayload {
  sub: string;
  email?: string;
  role?: string;
  [key: string]: any;
}


export const CurrentUser = createParamDecorator(
  (data: keyof JwtUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);