import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface JwtUserPayload {
  userId: string;
  email?: string;
  role?: string;
  [key: string]: any;
}


export const CurrentUser = createParamDecorator(
  (data: keyof JwtUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (data === 'id' || data === 'sub' || data === 'userId') {
      return user.id || user.userId || user.sub;
    }

    return data ? user[data] : user;
  },
);