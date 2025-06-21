import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserResponse } from './dto/user-response.dto';
import { PrismaService } from 'src/common/provider/prisma.service';
import { RegisterMahasiswaRequest } from './dto/register-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUserRequest } from './dto/register-user-request.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

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
                role: request.role,
                password: await bcrypt.hash(request.password, 10),
                mahasiswa: {
                    create: {
                        nama: request.name,
                        semester: request.semester,
                        jurusan: request.jurusan,
                    },
                },
            },
        });

        return this.toUserResponse(request);
    }

    toUserResponse(request: RegisterUserRequest): UserResponse {
        return {
            id: request.id,
            role: request.role,
            name: request.name,
        };
    }
}
