import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MhsNilaiMatkul, TipeNilaiMatkul } from '@prisma/client';
import { PrismaService } from 'src/common/provider/prisma.service';
import { FindAllMahasiswaNilaiMatkulResponse } from '../dto/response/find-all-mahasiswa-nilai-matkul-response.dto';
import { MahasiswaService } from './mahasiswa.service';
import { MatkulService } from 'src/modules/matkul/services/matkul.service';
import { UpdateMahasiswaNilaiMatkulRequest } from '../dto/request/update-mahasiswa-nilai-matkul-request.dto';
import { UpdateMahasiswaNilaiMatkulRequestBody } from '../dto/request/mahasiswa-nilai-matkul-request.dto';
import { MahasiswaNilaiMatkulResponse } from '../dto/response/mahasiswa-nilai-matkul-response.dto';
import { MahasiswaAmbilMatkulService } from './mahasiswa-ambil-matkul.sevice';

@Injectable()
export class MahasiswaNilaiMatkulService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => MahasiswaService))
        private readonly mahasiswaService: MahasiswaService,
        @Inject(forwardRef(() => MatkulService))
        private readonly matkulService: MatkulService,
        private readonly mahasiswaAmbilMatkulService: MahasiswaAmbilMatkulService,
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
                    bobot: 10,
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
                bobot: 20,
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
                bobot: 30,
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

        const mhsAmbilMatkul =
            await this.mahasiswaAmbilMatkulService.ensureMahasiswaMengambilMatkulExistsOrThrow(
                nim,
                kode_matkul,
                semester,
            );

        const mhsNilaiMatkul = await this.prismaService.mhsNilaiMatkul.findMany(
            {
                where: {
                    nim,
                    semester,
                    kode_matkul,
                },
            },
        );

        return {
            allMatkul: mhsNilaiMatkul,
            summary: {
                average: mhsAmbilMatkul.nilai,
                nilai_huruf: mhsAmbilMatkul.nilai_huruf,
            },
        };
    }

    async update(
        param: UpdateMahasiswaNilaiMatkulRequest,
        request: UpdateMahasiswaNilaiMatkulRequestBody,
    ): Promise<MahasiswaNilaiMatkulResponse> {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(param.nim);
        await this.mahasiswaAmbilMatkulService.ensureMahasiswaMengambilMatkulExistsOrThrow(
            param.nim,
            param.kode_matkul,
            param.semester,
        );

        const nilaiMatkul: MhsNilaiMatkul =
            await this.prismaService.mhsNilaiMatkul.update({
                where: {
                    kode_matkul_nim_semester_tipe: {
                        ...param,
                        tipe: request.tipe,
                    },
                },
                data: request,
            });

        await this.mahasiswaAmbilMatkulService.updateNilai(
            param.nim,
            param.kode_matkul,
            param.semester,
        );

        return nilaiMatkul;
    }

    async ensureMahasiswaNilaiExistsOrThrow(
        nim: string,
        kode_matkul: string,
        semester: number,
    ): Promise<void> {
        const count: number = await this.prismaService.mhsNilaiMatkul.count({
            where: {
                nim,
                kode_matkul,
                semester,
            },
        });

        if (count == null) {
            throw new NotFoundException('Mahasiswa Tidak Mengambil Matkul Ini');
        }
    }
}
