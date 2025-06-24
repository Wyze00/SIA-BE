import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreatMahasiswaRequest } from './dto/create-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { MahasiswaRespone } from './dto/mahasiswa-response.dto';
import { UpdateMahasiswaRequest } from './dto/update-mahasiswa-request.dto';
import { $Enums, Mahasiswa } from '@prisma/client';

@Injectable()
export class MahasiswaService {
    constructor(private readonly prismaService: PrismaService) {}

    async deleteMahasiswa(nim: string): Promise<boolean> {
        const count = await this.prismaService.mahasiswa.count({
            where: {
                nim: nim,
            },
        });

        if (!count) {
            throw new HttpException(
                'Mahasiswa Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.prismaService.$transaction([
            this.prismaService.mahasiswa.delete({
                where: {
                    nim: nim,
                },
            }),
            this.prismaService.user.delete({
                where: {
                    id: nim,
                },
            }),
        ]);

        return true;
    }

    async findMahasiswa(nim: string): Promise<MahasiswaRespone> {
        const mhs: Mahasiswa | null =
            await this.prismaService.mahasiswa.findUnique({
                where: {
                    nim: nim,
                },
            });

        return mhs!;
    }

    async findMahasiswaByNim(nim: string): Promise<MahasiswaRespone> {
        const mhs: Mahasiswa | null =
            await this.prismaService.mahasiswa.findUnique({
                where: {
                    nim: nim,
                },
            });

        if (!mhs) {
            throw new HttpException(
                'Mahasiswa Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        return mhs;
    }

    async findManyMahasiswa(
        jurusan?: $Enums.Jurusan,
        semester?: number,
        angkatan?: string,
    ): Promise<MahasiswaRespone[]> {
        const query: Record<string, any>[] = [];

        if (jurusan) {
            query.push({
                jurusan: jurusan,
            });
        }

        if (semester) {
            query.push({
                semester: semester,
            });
        }

        if (angkatan) {
            query.push({
                angkatan: angkatan,
            });
        }

        const mhs: Mahasiswa[] = await this.prismaService.mahasiswa.findMany({
            where: {
                AND: query,
            },
        });

        return mhs;
    }

    async updateMahasiswa(
        request: UpdateMahasiswaRequest,
        nim: string,
    ): Promise<MahasiswaRespone> {
        const isValidOldNim = await this.prismaService.mahasiswa.count({
            where: {
                nim: nim,
            },
        });

        if (!isValidOldNim) {
            throw new HttpException(
                'Mahasiswa Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        const isValidNewNim = await this.prismaService.mahasiswa.count({
            where: {
                nim: request.nim,
            },
        });

        if (isValidNewNim && nim != request.nim) {
            throw new HttpException('NIM sudah ada', HttpStatus.CONFLICT);
        }

        const mhs = await this.prismaService.user.update({
            where: {
                id: nim,
            },
            data: {
                id: request.nim,
                name: request.name,
                mahasiswa: {
                    update: {
                        data: {
                            name: request.name,
                            jurusan: request.jurusan,
                            semester: request.semester,
                            angkatan: request.angkatan,
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
                        angkatan: request.angkatan,
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
