import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaService } from 'src/modules/mahasiswa/services/mahasiswa.service';
import { MhsMengambilMatkulWithMatkulAndDosen } from '../dto/types/mhsMengambilMatkul-with-matkul-and-dosen.type';
import { $Enums, Mahasiswa } from '@prisma/client';
import { MatkulRecomendationWithMatkulAndDosen } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendationService } from './matkul-recomendation.service';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';
import { MatkulService } from './matkul.service';
import { MahasiswaAbsenMatkulService } from 'src/modules/mahasiswa/services/mahasiswa-absen-matkul.service';
import { MahasiswaNilaiMatkulService } from 'src/modules/mahasiswa/services/mahasiswa-nilai-matkul.service';
import { MahasiswaTotalNilaiService } from 'src/modules/mahasiswa/services/mahasiswa-total-nilai.service';
import { MatkulResponse } from '../dto/response/matkul-reesponse.dto';

@Injectable()
export class MatkulRecomendationMahasiswaService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => MahasiswaService))
        private readonly mahasiswaService: MahasiswaService,
        private readonly matkulRecomendationService: MatkulRecomendationService,
        private readonly matkulService: MatkulService,
        @Inject(forwardRef(() => MahasiswaAbsenMatkulService))
        private readonly mahasiswaAbsenService: MahasiswaAbsenMatkulService,
        @Inject(forwardRef(() => MahasiswaNilaiMatkulService))
        private readonly mahasiswaNilaiService: MahasiswaNilaiMatkulService,
        @Inject(forwardRef(() => MahasiswaTotalNilaiService))
        private readonly mahasiswaTotalNilaiService: MahasiswaTotalNilaiService,
    ) {}

    // CRUD

    async getAllMhsMengambilMaktulWithMatkulAndDosen(
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

    async getSelectedRecomendation(
        nim: string,
        semester: number,
    ): Promise<MatkulResponse[]> {
        const mhsMengambilMatkul: MhsMengambilMatkulWithMatkulAndDosen[] =
            await this.getAllMhsMengambilMaktulWithMatkulAndDosen(
                nim,
                semester,
            );

        return mhsMengambilMatkul.map((m) =>
            this.formatMhsMengambilMatkulWithMakulAndDosen(m),
        );
    }

    async getRecomendedRecomendation(
        selectedRecomendation: MatkulResponse[],
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulResponse[]> {
        const kode_matkul = this.mapToKodeMatkul(selectedRecomendation);

        const mhsMengambilMatkul: MatkulRecomendationWithMatkulAndDosen[] =
            await this.matkulRecomendationService.getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusanAndNotInKodeMatkul(
                semester,
                jurusan,
                kode_matkul,
            );

        return mhsMengambilMatkul.map((m) =>
            this.matkulRecomendationService.formatMatkulRecomendationWithMatkulAndDosenToMatkulResponse(
                m,
            ),
        );
    }

    async getAllMatkulRecomendation(
        selectedRecomendation: MatkulResponse[],
        recomendedRecomendation: MatkulResponse[],
    ): Promise<MatkulResponse[]> {
        const kode_matkul = this.mapToKodeMatkul(selectedRecomendation).concat(
            this.mapToKodeMatkul(recomendedRecomendation),
        );

        const matkul: MatkulWithDosen[] =
            await this.matkulService.getAllMatkulWithDosenByNotInKodeMakul(
                kode_matkul,
            );

        return matkul.map((m) =>
            this.matkulService.formatMatkulWithDosenToMatkulResponse(m),
        );
    }

    // Core

    async findAll(
        nim: string,
        semester: number,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        const mahasiswa: Mahasiswa =
            await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);

        const selectedRecomendation: MatkulResponse[] =
            await this.getSelectedRecomendation(mahasiswa.nim, semester);

        const recomendedRecomendation: MatkulResponse[] =
            await this.getRecomendedRecomendation(
                selectedRecomendation,
                semester,
                mahasiswa.jurusan,
            );

        const allRecomendation: MatkulResponse[] =
            await this.getAllMatkulRecomendation(
                selectedRecomendation,
                recomendedRecomendation,
            );

        return {
            selected: selectedRecomendation,
            recomended: recomendedRecomendation,
            allMatkul: allRecomendation,
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
                nilai: 0,
                persen_absensi: 0,
            },
        });

        await this.mahasiswaAbsenService.init(
            nim,
            semester,
            kode_matkul,
            matkul.total_pertemuan,
        );

        await this.mahasiswaNilaiService.init(nim, semester, kode_matkul);

        await this.mahasiswaTotalNilaiService.incremenetSKS(
            nim,
            semester,
            matkul.total_sks,
        );
    }

    async remove(nim: string, semester: number, kode_matkul: string) {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        const matkul =
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

        await this.mahasiswaTotalNilaiService.decrementSKS(
            nim,
            semester,
            matkul.total_sks,
        );
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
        raw: MhsMengambilMatkulWithMatkulAndDosen,
    ): MatkulResponse {
        const matkul: MatkulWithDosen = raw.matkul;
        return {
            kode_matkul: matkul.kode_matkul,
            name: matkul.name,
            total_sks: matkul.total_sks,
            total_pertemuan: matkul.total_pertemuan,
            dosen_nip: matkul.dosen_nip,
            dosen_name: matkul.dosen.name,
        };
    }

    mapToKodeMatkul(recomendation: MatkulResponse[]): string[] {
        return recomendation.map((r) => r.kode_matkul);
    }
}
