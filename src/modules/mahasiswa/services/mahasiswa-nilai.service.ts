import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TipeNilaiMatkul } from '@prisma/client';
import { PrismaService } from 'src/common/provider/prisma.service';
import { FindAllMahasiswaNilaiMatkulResponse } from '../dto/response/find-all-mahasiswa-nilai-matkul-response.dto';
import { MahasiswaService } from './mahasiswa.service';
import { MatkulService } from 'src/modules/matkul/services/matkul.service';

@Injectable()
export class MahasiswaNilaiMatkulService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => MahasiswaService))
        private readonly mahasiswaService: MahasiswaService,
        @Inject(forwardRef(() => MatkulService))
        private readonly matkulService: MatkulService,
    ) {}

    async init(nim: string, semester: number, kode_matkul: string) {
        await this.initQuiz(nim, semester, kode_matkul);
        await this.initUts(nim, semester, kode_matkul);
        await this.initUas(nim, semester, kode_matkul);
    }

    async initQuiz(
        nim: string,
        semester: number,
        kode_matkul: string,
    ): Promise<void> {
        for (let quiz = 1; quiz <= 5; quiz++) {
            await this.prismaService.mhsNilaiMatkul.create({
                data: {
                    nilai: 0,
                    semester,
                    bobot: 0,
                    kode_matkul,
                    nim,
                    tipe: ('QUIZ' + quiz) as TipeNilaiMatkul,
                },
            });
        }
    }
    async initUts(
        nim: string,
        semester: number,
        kode_matkul: string,
    ): Promise<void> {
        await this.prismaService.mhsNilaiMatkul.create({
            data: {
                nilai: 0,
                semester,
                bobot: 0,
                kode_matkul,
                nim,
                tipe: 'UTS',
            },
        });
    }

    async initUas(
        nim: string,
        semester: number,
        kode_matkul: string,
    ): Promise<void> {
        await this.prismaService.mhsNilaiMatkul.create({
            data: {
                nilai: 0,
                semester,
                bobot: 0,
                kode_matkul,
                nim,
                tipe: 'UAS',
            },
        });
    }

    async removeOne(nim: string, semester: number, kode_matkul: string) {
        await this.prismaService.mhsNilaiMatkul.deleteMany({
            where: {
                nim,
                semester,
                kode_matkul,
            },
        });
    }

    async removeAll(nim: string) {
        await this.prismaService.mhsNilaiMatkul.deleteMany({
            where: {
                nim,
            },
        });
    }

    async findAll(
        nim: string,
        semester: number,
        kode_matkul: string,
    ): Promise<FindAllMahasiswaNilaiMatkulResponse> {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        await this.matkulService.ensureMatkulExistsOrThrow(kode_matkul);

        const mhsNilaiMatkul = await this.prismaService.mhsNilaiMatkul.findMany(
            {
                where: {
                    nim,
                    semester,
                    kode_matkul,
                },
            },
        );

        const mhsAmbilMatkul =
            await this.prismaService.mhsMengambilMatkul.findUnique({
                where: {
                    kode_matkul_nim_semester: {
                        kode_matkul,
                        semester,
                        nim,
                    },
                },
            });

        return {
            all: mhsNilaiMatkul,
            nilai: {
                average: mhsAmbilMatkul!.nilai,
                nilai_huruf: mhsAmbilMatkul!.nilai_huruf,
            },
        };
    }
}
