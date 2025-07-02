import { BadRequestException, Injectable } from '@nestjs/common';
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
        const user: User = await this.ensureUserExists(request.id);
        await this.ensurePasswordValid(request.password, user.password);

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

    async ensureUserExists(id: string): Promise<User> {
        const user: User | null = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });

        if (user == null) {
            throw new BadRequestException('Username Atau Password Salah');
        }

        return user;
    }

    async ensurePasswordValid(password: string, hash: string): Promise<void> {
        const isPasswordValid: boolean = await bcrypt.compare(password, hash);

        if (isPasswordValid == false) {
            throw new BadRequestException('Username Atau Password Salah');
        }
    }
}
