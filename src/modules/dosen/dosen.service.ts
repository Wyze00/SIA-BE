import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { DosenResponse } from './dto/dosen-response.dto';
import * as bcrypt from 'bcrypt';
import { UpdateDosenRequest } from './dto/update-dosen-request.dto';
import { Dosen } from '@prisma/client';

@Injectable()
export class DosenService {
    constructor(private readonly prismaService: PrismaService) {}

    async createDosen(request: CreateDosenRequest): Promise<DosenResponse> {
        const count: number = await this.prismaService.dosen.count({
            where: {
                nip: request.id,
            },
        });

        if (count) {
            throw new HttpException('Dosen Sudah Ada', HttpStatus.BAD_REQUEST);
        }

        const dosen = await this.prismaService.user.create({
            data: {
                id: request.id,
                name: request.name,
                role: 'dosen',
                password: await bcrypt.hash(request.password, 10),
                dosen: {
                    create: {
                        name: request.name,
                    },
                },
            },
            include: {
                dosen: true,
            },
        });

        return dosen.dosen!;
    }

    async updateDosen(
        nip: string,
        request: UpdateDosenRequest,
    ): Promise<DosenResponse> {
        const isValidOldNip = await this.prismaService.dosen.count({
            where: {
                nip: nip,
            },
        });

        if (!isValidOldNip) {
            throw new HttpException(
                'Mahasiswa Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        const isValidNewNip = await this.prismaService.dosen.count({
            where: {
                nip: request.nip,
            },
        });

        if (isValidNewNip && nip != request.nip) {
            throw new HttpException('NIP sudah ada', HttpStatus.CONFLICT);
        }

        const dosen = await this.prismaService.user.update({
            where: {
                id: nip,
            },
            data: {
                id: request.nip,
                name: request.name,
                dosen: {
                    update: {
                        data: {
                            name: request.name,
                        },
                    },
                },
            },
            include: {
                dosen: true,
            },
        });

        return dosen.dosen!;
    }

    async findDosen(nip: string): Promise<DosenResponse> {
        const dosen: Dosen | null = await this.prismaService.dosen.findUnique({
            where: {
                nip: nip,
            },
        });

        return dosen!;
    }

    async findDosenByNip(nip: string): Promise<DosenResponse> {
        const dosen: Dosen | null = await this.prismaService.dosen.findUnique({
            where: {
                nip: nip,
            },
        });

        if (!dosen) {
            throw new HttpException(
                'Dosen Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        return dosen;
    }
}
