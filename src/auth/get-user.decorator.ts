import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './schema/user.schema';

export const GetUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): User => {
		const request = ctx.switchToHttp().getRequest<{ user: User }>();
		return request.user;
	},
);
