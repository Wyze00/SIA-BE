import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaService } from 'src/modules/mahasiswa/mahasiswa.service';
import { MhsMengambilMatkulWithMatkulAndDosen } from '../dto/types/mhsMengambilMatkul-with-matkul-and-dosen.type';
import { Mahasiswa } from '@prisma/client';
import { MatkulRecomendationWithMatkulAndDosen } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendationService } from './matkul-recomendation.service';
import { MatkulRecomendation } from '../dto/types/matkul-recomendation.type';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';
import { MatkulService } from './matkul.service';

@Injectable()
export class MatkulRecomendationMahasiswaService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mahasiswaService: MahasiswaService,
        private readonly matkulRecomendationService: MatkulRecomendationService,
        private readonly matkulService: MatkulService,
    ) {}

    // CRUD

    async getMhsMengambilMaktulWithMatkulAndDosen(
        nim: string,
        semester: number,
    ): Promise<MhsMengambilMatkulWithMatkulAndDosen[]> {
        const mhsMengambilMatkul: MhsMengambilMatkulWithMatkulAndDosen[] =
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

        return mhsMengambilMatkul;
    }

    async findAll(
        nim: string,
        semester: number,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        const mahasiswa: Mahasiswa =
            await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);

        const rawMhsMengambilMatkul: MhsMengambilMatkulWithMatkulAndDosen[] =
            await this.getMhsMengambilMaktulWithMatkulAndDosen(
                mahasiswa.nim,
                semester,
            );

        const inRecomendation: MatkulRecomendation =
            this.formatMhsMengambilMatkulWithMakulAndDosen(
                rawMhsMengambilMatkul,
            );

        const allKode = inRecomendation.map((f) => f.kode_matkul);

        const rawMatkulRecomendation: MatkulRecomendationWithMatkulAndDosen[] =
            await this.matkulRecomendationService.getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusanAndNotInKodeMatkul(
                semester,
                mahasiswa.jurusan,
                allKode,
            );

        const formated =
            this.matkulRecomendationService.formatMatkulRecomendationWithMatkulAndDosen(
                rawMatkulRecomendation,
            );

        const allKode2 = allKode.concat(formated.map((f) => f.kode_matkul));

        const matkuls: MatkulWithDosen[] =
            await this.matkulService.getMatkulWithDosenByNotInKodeMakul(
                allKode2,
            );

        const formated2 =
            this.matkulRecomendationService.formatMatkulWithDosen(matkuls);

        return {
            in: inRecomendation,
            notIn: formated,
            all: formated2,
        };
    }

    formatMhsMengambilMatkulWithMakulAndDosen(
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
