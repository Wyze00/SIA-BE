import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../dto/request-user.dto';
import { UserRole } from '../dto/user-role.dto';

export const User = createParamDecorator(
    (data: any, context: ExecutionContext): UserRole => {
        const request: RequestUser = context.switchToHttp().getRequest();
        return request.user;
    },
);
