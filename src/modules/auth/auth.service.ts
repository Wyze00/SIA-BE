import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserResponse } from './dto/user-response.dto';
import { PrismaService } from 'src/common/provider/prisma.service';
import { RegisterMahasiswaRequest } from './dto/register-mahasiswa.dto';
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

        const response: UserResponse = this.toUserResponse(user);

        return {
            ...response,
            token: token,
        };
    }

    async createMahasiswa(
        request: RegisterMahasiswaRequest,
    ): Promise<UserResponse> {
        const count: number = await this.prismaService.mahasiswa.count({
            where: {
                nim: request.id,
            },
        });

        if (count) {
            throw new HttpException(
                'Mahasiswa Sudah Ada',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.prismaService.user.create({
            data: {
                id: request.id,
                name: request.name,
                role: request.role,
                password: await bcrypt.hash(request.password, 10),
                mahasiswa: {
                    create: {
                        name: request.name,
                        semester: request.semester,
                        jurusan: request.jurusan,
                    },
                },
            },
        });

        return this.toUserResponse(request);
    }

    toUserResponse(request: User): UserResponse {
        return {
            id: request.id,
            role: request.role,
            name: request.name,
        };
    }
}
