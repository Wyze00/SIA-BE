import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatkulRequest } from './dto/create-matkul-request.dto';
import { UpdateMatkulRequest } from './dto/update-matkul.dto-request';
import { PrismaService } from 'src/common/provider/prisma.service';
import { $Enums, Matkul, RekomendasiMatkul } from '@prisma/client';
import { MatkulResponse } from './dto/matkul-reesponse.dto';
import { RecomendationMatkul } from './dto/recomendation-matkul.dto';

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

    async findAllRecomendation(semester: number, jurusan: $Enums.Jurusan) {
        if (semester < 1 || semester > 8) {
            throw new HttpException(
                'Semester Must Be 1 Until 8',
                HttpStatus.BAD_REQUEST,
            );
        }

        const rekomendasiRaw =
            await this.prismaService.rekomendasiMatkul.findMany({
                where: { semester, jurusan },
                include: {
                    matkul: {
                        include: {
                            dosen: true,
                        },
                    },
                },
            });

        const rekomendasi = rekomendasiRaw.map((r) => {
            const m = r.matkul;
            return {
                kode_matkul: m.kode_matkul,
                name: m.name,
                total_sks: m.total_sks,
                total_pertemuan: m.total_pertemuan,
                dosen_nip: m.dosen_nip,
                dosen_name: m.dosen.name,
            };
        });

        const allMatkul = await this.prismaService.matkul.findMany({
            include: { dosen: true },
        });

        const notIn = allMatkul
            .filter(
                (matkul) =>
                    !rekomendasi.find(
                        (r) => r.kode_matkul === matkul.kode_matkul,
                    ),
            )
            .map((m) => ({
                kode_matkul: m.kode_matkul,
                name: m.name,
                total_sks: m.total_sks,
                total_pertemuan: m.total_pertemuan,
                dosen_nip: m.dosen_nip,
                dosen_name: m.dosen.name,
            }));

        return { in: rekomendasi, notIn };
    }

    async addRecomendation(
        request: RecomendationMatkul,
    ): Promise<RecomendationMatkul> {
        const isValidMatkul = await this.prismaService.matkul.findUnique({
            where: {
                kode_matkul: request.kode_matkul,
            },
        });

        if (!isValidMatkul) {
            throw new HttpException(
                'Matkul Tidak Ditemukn',
                HttpStatus.NOT_FOUND,
            );
        }

        const isAlreadyAdded =
            await this.prismaService.rekomendasiMatkul.findUnique({
                where: {
                    kode_matkul: request.kode_matkul,
                    jurusan: request.jurusan,
                    semester: request.semester,
                },
            });

        if (isAlreadyAdded) {
            throw new HttpException(
                'Rekomendasi Matkul Sudah Ada',
                HttpStatus.BAD_REQUEST,
            );
        }

        const matkul: RekomendasiMatkul =
            await this.prismaService.rekomendasiMatkul.create({
                data: {
                    kode_matkul: request.kode_matkul,
                    semester: request.semester,
                    jurusan: request.jurusan,
                },
            });

        return matkul;
    }

    async removeRecomendation(request: RecomendationMatkul): Promise<boolean> {
        const isValidMatkul = await this.prismaService.matkul.findUnique({
            where: {
                kode_matkul: request.kode_matkul,
            },
        });

        if (!isValidMatkul) {
            throw new HttpException(
                'Matkul Tidak Ditemukn',
                HttpStatus.NOT_FOUND,
            );
        }

        const isAlreadyAdded =
            await this.prismaService.rekomendasiMatkul.findUnique({
                where: {
                    kode_matkul: request.kode_matkul,
                    jurusan: request.jurusan,
                    semester: request.semester,
                },
            });

        if (!isAlreadyAdded) {
            throw new HttpException(
                'Rekomendasi Matkul Tidak Ada',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.prismaService.rekomendasiMatkul.delete({
            where: {
                kode_matkul: request.kode_matkul,
                semester: request.semester,
                jurusan: request.jurusan,
            },
        });

        return true;
    }
}
