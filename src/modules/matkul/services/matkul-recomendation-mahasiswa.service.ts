import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaService } from 'src/modules/mahasiswa/mahasiswa.service';
import { MhsMengambilMatkulWithMatkulAndDosen } from '../dto/types/mhsMengambilMatkul-with-matkul-and-dosen.type';
import { Mahasiswa } from '@prisma/client';
import { RawMatkulRecomendation } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendationService } from './matkul-recomendation.service';
import { MatkulRecomendation } from '../dto/types/matkul-recomendation.type';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';

@Injectable()
export class MatkulRecomendationMahasiswaService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mahasiswaService: MahasiswaService,
        private readonly matkulRecomendationService: MatkulRecomendationService,
    ) {}

    async findAll(
        nim: string,
        semester: number,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        const mahasiswa: Mahasiswa =
            await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);

        const rawMhsMengambilMatkul: MhsMengambilMatkulWithMatkulAndDosen[] =
            await this.prismaService.mhsMengambilMatkul.findMany({
                where: {
                    nim,
                    semester,
                },
                include: {
                    matkul: {
                        include: {
                            dosen: true,
                        },
                    },
                },
            });

        const formatMhsMengambilMatkul: MatkulRecomendation =
            this.formatRawMhsMengambilMatkulWithMakulAndDosen(
                rawMhsMengambilMatkul,
            );

        const allKode = formatMhsMengambilMatkul.map((f) => f.kode_matkul);

        const rawMatkulRecomendation: RawMatkulRecomendation =
            await this.prismaService.rekomendasiMatkul.findMany({
                where: {
                    AND: [
                        {
                            jurusan: mahasiswa.jurusan,
                        },
                        {
                            semester,
                        },
                        {
                            kode_matkul: {
                                notIn: allKode,
                            },
                        },
                    ],
                },
                include: {
                    matkul: {
                        include: {
                            dosen: true,
                        },
                    },
                },
            });

        const formated =
            this.matkulRecomendationService.formatRawMatkulRecomendation(
                rawMatkulRecomendation,
            );

        const allKode2 = allKode.concat(formated.map((f) => f.kode_matkul));

        const allMatkul: RawMatkulRecomendation =
            await this.prismaService.rekomendasiMatkul.findMany({
                where: {
                    AND: [
                        {
                            jurusan: mahasiswa.jurusan,
                        },
                        {
                            semester,
                        },
                        {
                            kode_matkul: {
                                notIn: allKode2,
                            },
                        },
                    ],
                },
                include: {
                    matkul: {
                        include: {
                            dosen: true,
                        },
                    },
                },
            });

        const formated2 =
            this.matkulRecomendationService.formatRawMatkulRecomendation(
                allMatkul,
            );

        return {
            in: formatMhsMengambilMatkul,
            notIn: formated,
            all: formated2,
        };
    }

    formatRawMhsMengambilMatkulWithMakulAndDosen(
        raw: MhsMengambilMatkulWithMatkulAndDosen[],
    ): MatkulRecomendation {
        return raw.map((r) => {
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
    }
}
