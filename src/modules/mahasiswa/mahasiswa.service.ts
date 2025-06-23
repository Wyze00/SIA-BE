import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreatMahasiswaRequest } from './dto/create-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { MahasiswaRespone } from './dto/mahasiswa-response.dto';
import { UpdateMahasiswaRequest } from './dto/update-mahasiswa-request.dto';
import { Mahasiswa } from '@prisma/client';

@Injectable()
export class MahasiswaService {
    constructor(private readonly prismaService: PrismaService) {}

    async findMahasiswa(nim: string): Promise<MahasiswaRespone> {
        const mhs: Mahasiswa | null =
            await this.prismaService.mahasiswa.findUnique({
                where: {
                    nim: nim,
                },
            });

        return mhs!;
    }

    async updateMahasiswa(
        request: UpdateMahasiswaRequest,
    ): Promise<MahasiswaRespone> {
        const mhs = await this.prismaService.user.update({
            where: {
                id: request.nim,
            },
            data: {
                id: request.newNim,
                name: request.name,
                mahasiswa: {
                    update: {
                        data: {
                            name: request.name,
                            jurusan: request.jurusan,
                            semester: request.semester,
                        },
                    },
                },
            },
            include: {
                mahasiswa: true,
            },
        });

        return mhs.mahasiswa!;
    }

    async createMahasiswa(
        request: CreatMahasiswaRequest,
    ): Promise<MahasiswaRespone> {
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

        const mhs = await this.prismaService.user.create({
            data: {
                id: request.id,
                name: request.name,
                role: 'mahasiswa',
                password: await bcrypt.hash(request.password, 10),
                mahasiswa: {
                    create: {
                        name: request.name,
                        jurusan: request.jurusan,
                        semester: request.semester,
                    },
                },
            },
            include: {
                mahasiswa: true,
            },
        });

        return mhs.mahasiswa!;
    }
}
