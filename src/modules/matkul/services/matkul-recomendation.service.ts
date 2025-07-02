import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { $Enums, RekomendasiMatkul } from '@prisma/client';
import { RecomendationMatkul } from '../dto/recomendation-matkul.dto';

@Injectable()
export class MatkulRecomendationService {
    constructor(private readonly prismaService: PrismaService) {}

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
