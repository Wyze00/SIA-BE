import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatkulRequest } from '../dto/requet/create-matkul-request.dto';
import { UpdateMatkulRequest } from '../dto/requet/update-matkul.dto-request';
import { PrismaService } from 'src/common/provider/prisma.service';
import { Matkul } from '@prisma/client';
import { MatkulResponse } from '../dto/response/matkul-reesponse.dto';

@Injectable()
export class MatkulService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(request: CreateMatkulRequest): Promise<MatkulResponse> {
        const isDosenValid = await this.prismaService.dosen.findUnique({
            where: {
                nip: request.dosen_nip,
            },
        });

        if (!isDosenValid) {
            throw new HttpException(
                'Dosen Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        const isMatkulValid = await this.prismaService.matkul.findUnique({
            where: {
                kode_matkul: request.kode_matkul,
            },
        });

        if (isMatkulValid) {
            throw new HttpException(
                'Kode Matkul Sudah Ada',
                HttpStatus.CONFLICT,
            );
        }

        const matkul: Matkul = await this.prismaService.matkul.create({
            data: request,
        });

        return matkul;
    }

    async findAll(): Promise<MatkulResponse[]> {
        const matkul: Matkul[] = await this.prismaService.matkul.findMany();
        return matkul;
    }

    async findOne(kode_matkul: string): Promise<MatkulResponse> {
        const matkul: Matkul | null =
            await this.prismaService.matkul.findUnique({
                where: {
                    kode_matkul,
                },
            });

        if (!matkul) {
            throw new HttpException(
                'Matkul Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        return matkul;
    }

    async update(
        kode_matkul: string,
        request: UpdateMatkulRequest,
    ): Promise<MatkulResponse> {
        const isValidMatkul = await this.prismaService.matkul.findUnique({
            where: {
                kode_matkul,
            },
        });

        if (!isValidMatkul) {
            throw new HttpException(
                'Matkul Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        const updatedMatkul: Matkul = await this.prismaService.matkul.update({
            where: {
                kode_matkul,
            },
            data: request,
        });

        return updatedMatkul;
    }

    async remove(kode_matkul: string): Promise<boolean> {
        const isValidMatkul = await this.prismaService.matkul.count({
            where: {
                kode_matkul,
            },
        });

        if (!isValidMatkul) {
            throw new HttpException(
                'Matkul Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.prismaService.matkul.delete({
            where: {
                kode_matkul,
            },
        });

        return true;
    }
}
