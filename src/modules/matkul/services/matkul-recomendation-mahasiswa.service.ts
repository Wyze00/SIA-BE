import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaService } from 'src/modules/mahasiswa/services/mahasiswa.service';
import { MhsMengambilMatkulWithMatkulAndDosen } from '../dto/types/mhsMengambilMatkul-with-matkul-and-dosen.type';
import { $Enums, Mahasiswa } from '@prisma/client';
import { MatkulRecomendationWithMatkulAndDosen } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendationService } from './matkul-recomendation.service';
import { MatkulRecomendation } from '../dto/types/matkul-recomendation.type';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';
import { MatkulService } from './matkul.service';
import { MahasiswaAbsenService } from 'src/modules/mahasiswa/services/mahasiswa.-absenservice';
import { MahasiswaNilaiService } from 'src/modules/mahasiswa/services/mahasiswa-nilai.service';

@Injectable()
export class MatkulRecomendationMahasiswaService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => MahasiswaService))
        private readonly mahasiswaService: MahasiswaService,
        private readonly matkulRecomendationService: MatkulRecomendationService,
        private readonly matkulService: MatkulService,
        @Inject(forwardRef(() => MahasiswaAbsenService))
        private readonly mahasiswaAbsenService: MahasiswaAbsenService,
        @Inject(forwardRef(() => MahasiswaNilaiService))
        private readonly mahasiswaNilaiService: MahasiswaNilaiService,
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

    // Login

    async getInRecomendation(
        nim: string,
        semester: number,
    ): Promise<MatkulRecomendation> {
        const mhsMengambilMatkul: MhsMengambilMatkulWithMatkulAndDosen[] =
            await this.getMhsMengambilMaktulWithMatkulAndDosen(nim, semester);

        return this.formatMhsMengambilMatkulWithMakulAndDosen(
            mhsMengambilMatkul,
        );
    }

    async getNotInRecomendation(
        inRecomendation: MatkulRecomendation,
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulRecomendation> {
        const kode_matkul = this.mapToKodeMatkul(inRecomendation);

        const mhsMengambilMatkul: MatkulRecomendationWithMatkulAndDosen[] =
            await this.matkulRecomendationService.getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusanAndNotInKodeMatkul(
                semester,
                jurusan,
                kode_matkul,
            );

        return this.matkulRecomendationService.formatMatkulRecomendationWithMatkulAndDosen(
            mhsMengambilMatkul,
        );
    }

    async getAllRecomendation(
        inRecomendation: MatkulRecomendation,
        notInRecomendation: MatkulRecomendation,
    ): Promise<MatkulRecomendation> {
        const kode_matkul = this.mapToKodeMatkul(inRecomendation).concat(
            this.mapToKodeMatkul(notInRecomendation),
        );

        const matkul: MatkulWithDosen[] =
            await this.matkulService.getMatkulWithDosenByNotInKodeMakul(
                kode_matkul,
            );

        return this.matkulRecomendationService.formatMatkulWithDosen(matkul);
    }

    // Core

    async findAll(
        nim: string,
        semester: number,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        const mahasiswa: Mahasiswa =
            await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);

        const inRecomendation: MatkulRecomendation =
            await this.getInRecomendation(mahasiswa.nim, semester);

        const notInRecomendation: MatkulRecomendation =
            await this.getNotInRecomendation(
                inRecomendation,
                semester,
                mahasiswa.jurusan,
            );

        const allRecomendation: MatkulRecomendation =
            await this.getAllRecomendation(inRecomendation, notInRecomendation);

        return {
            in: inRecomendation,
            notIn: notInRecomendation,
            all: allRecomendation,
        };
    }

    async create(nim: string, semester: number, kode_matkul: string) {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        const matkul =
            await this.matkulService.ensureMatkulExistsOrThrow(kode_matkul);

        await this.prismaService.mhsMengambilMatkul.create({
            data: {
                semester,
                status: 'diambil',
                kode_matkul,
                nim,
                nilai_huruf: '-',
            },
        });

        await this.mahasiswaAbsenService.init(
            nim,
            semester,
            kode_matkul,
            matkul.total_pertemuan,
        );

        await this.mahasiswaNilaiService.init(nim, semester, kode_matkul);
    }

    async remove(nim: string, semester: number, kode_matkul: string) {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        await this.matkulService.ensureMatkulExistsOrThrow(kode_matkul);

        await this.mahasiswaAbsenService.removeOne(nim, semester, kode_matkul);

        await this.mahasiswaNilaiService.removeOne(nim, semester, kode_matkul);

        await this.prismaService.mhsMengambilMatkul.delete({
            where: {
                kode_matkul_nim_semester: {
                    kode_matkul,
                    nim,
                    semester,
                },
            },
        });
    }

    async removeAll(nim: string): Promise<void> {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        await this.mahasiswaAbsenService.removeAll(nim);
        await this.mahasiswaNilaiService.removeAll(nim);
        await this.prismaService.mhsMengambilMatkul.deleteMany({
            where: {
                nim,
            },
        });
    }

    // Format

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

    mapToKodeMatkul(recomendation: MatkulRecomendation): string[] {
        return recomendation.map((r) => r.kode_matkul);
    }
}
