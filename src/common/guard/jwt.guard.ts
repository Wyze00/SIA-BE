import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { RequestUser } from '../dto/request-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../dto/user-role.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../provider/prisma.service';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        const token: string | undefined = request.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {
            const jwt: string = token.split(' ')[1];

            const decoded = this.jwtService.verify<UserRole>(jwt);
            request.user = decoded;

            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()],
            );

            if (!requiredRoles || requiredRoles.length === 0) return true;

            const count: number = await this.prismaService.user.count({
                where: {
                    id: decoded.id,
                },
            });

            return requiredRoles.includes(decoded.role) && count === 1;
        } catch (e: any) {
            throw new HttpException(
                `Unauthorized: ${e}`,
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
