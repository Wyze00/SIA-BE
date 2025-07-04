import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { $Enums, RekomendasiMatkul } from '@prisma/client';
import { MatkulRecomendationRequest } from '../dto/request/recomendation-matkul.dto';
import { MatkulRecomendationWithMatkulAndDosen } from '../dto/types/raw-recomendation.type';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';
import { FindAllMatkulRecomendationResponse } from '../dto/response/find-all-recomendation-matkul-response.dto';
import { MatkulRecomendationResponse } from '../dto/response/recomendation-matkul-response.dto';
import { MatkulService } from './matkul.service';
import { MatkulResponse } from '../dto/response/matkul-reesponse.dto';

@Injectable()
export class MatkulRecomendationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly matkulService: MatkulService,
    ) {}

    // Core

    async add(
        request: MatkulRecomendationRequest,
    ): Promise<MatkulRecomendationResponse> {
        await this.matkulService.ensureMatkulExistsOrThrow(request.kode_matkul);
        await this.ensureMatkulRecomendationNotExist(request);
        return await this.prismaService.rekomendasiMatkul.create({
            data: request,
        });
    }

    async remove(request: MatkulRecomendationRequest): Promise<void> {
        await this.matkulService.ensureMatkulExistsOrThrow(request.kode_matkul);
        await this.ensureMatkulRecomendationExists(request);
        await this.prismaService.rekomendasiMatkul.deleteMany({
            where: request,
        });
    }

    async findAll(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<FindAllMatkulRecomendationResponse> {
        this.validateSemester(semester);

        const inRecomendation = await this.getSelectedRecomendation(
            semester,
            jurusan,
        );

        const notInRecomendation =
            await this.getRecomendedRecomendation(inRecomendation);

        return {
            selected: inRecomendation,
            recomended: notInRecomendation,
        };
    }

    // CRUD

    async getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusan(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulRecomendationWithMatkulAndDosen[]> {
        const rawRecomendation: MatkulRecomendationWithMatkulAndDosen[] =
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

        return rawRecomendation;
    }

    async getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusanAndNotInKodeMatkul(
        semester: number,
        jurusan: $Enums.Jurusan,
        kode_matkul: string[],
    ): Promise<MatkulRecomendationWithMatkulAndDosen[]> {
        return await this.prismaService.rekomendasiMatkul.findMany({
            where: {
                AND: [
                    {
                        jurusan: jurusan,
                    },
                    {
                        semester,
                    },
                    {
                        kode_matkul: {
                            notIn: kode_matkul,
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
    }

    // Logic

    async getSelectedRecomendation(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulResponse[]> {
        const rawMatkulRecomendation: MatkulRecomendationWithMatkulAndDosen[] =
            await this.getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusan(
                semester,
                jurusan,
            );
        return rawMatkulRecomendation.map((m) =>
            this.formatMatkulRecomendationWithMatkulAndDosenToMatkulResponse(m),
        );
    }

    async getRecomendedRecomendation(
        inRecomendation: MatkulResponse[],
    ): Promise<MatkulResponse[]> {
        const kode_matkul: string[] = inRecomendation.map((m) => m.kode_matkul);

        const rawNotInMatkulRecomendation: MatkulWithDosen[] =
            await this.matkulService.getAllMatkulWithDosenByNotInKodeMakul(
                kode_matkul,
            );

        return rawNotInMatkulRecomendation.map((m) =>
            this.matkulService.formatMatkulWithDosenToMatkulResponse(m),
        );
    }

    // Validation

    async ensureMatkulRecomendationNotExist(
        request: MatkulRecomendationRequest,
    ): Promise<void> {
        const matkulRecomendation: RekomendasiMatkul | null =
            await this.prismaService.rekomendasiMatkul.findUnique({
                where: {
                    kode_matkul_semester_jurusan: request,
                },
            });

        if (matkulRecomendation) {
            throw new HttpException(
                'Rekomendasi Matkul Sudah Ada',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async ensureMatkulRecomendationExists(
        request: MatkulRecomendationRequest,
    ): Promise<void> {
        const matkulRecomendation: RekomendasiMatkul | null =
            await this.prismaService.rekomendasiMatkul.findUnique({
                where: {
                    kode_matkul_semester_jurusan: request,
                },
            });

        if (matkulRecomendation == null) {
            throw new HttpException(
                'Rekomendasi Matkul Tidak Ada',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    validateSemester(semester: number): void {
        if (semester < 1 || semester > 8) {
            throw new HttpException(
                'Semester Must Be 1 Until 8',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // Filter & Formatting

    formatMatkulRecomendationWithMatkulAndDosenToMatkulResponse(
        matkulRecomendation: MatkulRecomendationWithMatkulAndDosen,
    ): MatkulResponse {
        const matkul: MatkulWithDosen = matkulRecomendation.matkul;

        return {
            kode_matkul: matkul.kode_matkul,
            name: matkul.name,
            total_sks: matkul.total_sks,
            total_pertemuan: matkul.total_pertemuan,
            dosen_nip: matkul.dosen_nip,
            dosen_name: matkul.dosen.name,
        };
    }
}
