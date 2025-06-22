import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserRequest } from './dto/login-user-request.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponse } from './dto/login-user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(request: LoginUserRequest): Promise<LoginUserResponse> {
        const user: User | null = await this.prismaService.user.findUnique({
            where: {
                id: request.id,
            },
        });

        if (!user) {
            throw new HttpException(
                'Username atau Password Salah',
                HttpStatus.NOT_FOUND,
            );
        }

        const isPasswordValid: boolean = await bcrypt.compare(
            request.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new HttpException(
                'Username atau Password Salah',
                HttpStatus.NOT_FOUND,
            );
        }

        const token = this.jwtService.sign({
            id: user.id,
            role: user.role,
        });

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            token: token,
        };
    }
}
