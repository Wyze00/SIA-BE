import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { $Enums, Matkul, RekomendasiMatkul } from '@prisma/client';
import { MatkulRecomendationRequest } from '../dto/requet/recomendation-matkul.dto';
import { MatkulRecomendationWithMatkulAndDosen } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendation } from '../dto/types/matkul-recomendation.type';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';
import { FindAllMatkulRecomendationResponse } from '../dto/response/find-all-recomendation-matkul-response.dto';
import { MatkulRecomendationResponse } from '../dto/response/recomendation-matkul-response.dto';
import { MatkulService } from './matkul.service';

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
        await this.ensureMatkulExists(request.kode_matkul);
        await this.ensureRecomendationMatkulNotExist(request);
        return await this.prismaService.rekomendasiMatkul.create({
            data: request,
        });
    }

    async remove(request: MatkulRecomendationRequest): Promise<void> {
        await this.ensureMatkulExists(request.kode_matkul);
        await this.ensureRecomendationMatkulExist(request);
        await this.prismaService.rekomendasiMatkul.deleteMany({
            where: request,
        });
    }

    async findAll(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<FindAllMatkulRecomendationResponse> {
        this.validateSemester(semester);

        const inRecomendation = await this.getInRecomendation(
            semester,
            jurusan,
        );
        const notInRecomendation =
            await this.getNotInRecomendation(inRecomendation);

        return {
            in: inRecomendation,
            notIn: notInRecomendation,
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

    async getInRecomendation(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulRecomendation> {
        const rawMatkulRecomendation: MatkulRecomendationWithMatkulAndDosen[] =
            await this.getMaktulRecomendationWithMatkulAndDosenBySemesterAndJurusan(
                semester,
                jurusan,
            );
        return this.formatMatkulRecomendationWithMatkulAndDosen(
            rawMatkulRecomendation,
        );
    }

    async getNotInRecomendation(
        matkulRecomendation: MatkulRecomendation,
    ): Promise<MatkulRecomendation> {
        const allMatkulIncludeDosen: MatkulWithDosen[] =
            await this.matkulService.getMatkulWithDosen();
        const filteredMatkulIncludeDosen: MatkulWithDosen[] =
            this.filterMatkulIncludeDosenByMatkulRecomendation(
                allMatkulIncludeDosen,
                matkulRecomendation,
            );
        return this.formatMatkulWithDosen(filteredMatkulIncludeDosen);
    }

    // Validation

    async ensureMatkulExists(kode_matkul: string): Promise<void> {
        const matkul: Matkul | null =
            await this.prismaService.matkul.findUnique({
                where: {
                    kode_matkul,
                },
            });

        if (matkul == null) {
            throw new HttpException(
                'Matkul Tidak Ditemukan',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async ensureRecomendationMatkulNotExist(
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

    async ensureRecomendationMatkulExist(
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

    filterMatkulIncludeDosenByMatkulRecomendation(
        matkulIncludeDosen: MatkulWithDosen[],
        matkulRecomendation: MatkulRecomendation,
    ): MatkulWithDosen[] {
        return matkulIncludeDosen.filter(
            (matkul) =>
                !matkulRecomendation.find(
                    (r) => r.kode_matkul === matkul.kode_matkul,
                ),
        );
    }

    formatMatkulWithDosen(
        matkulIncludeDosen: MatkulWithDosen[],
    ): MatkulRecomendation {
        return matkulIncludeDosen.map((m) => ({
            kode_matkul: m.kode_matkul,
            name: m.name,
            total_sks: m.total_sks,
            total_pertemuan: m.total_pertemuan,
            dosen_nip: m.dosen_nip,
            dosen_name: m.dosen.name,
        }));
    }

    formatMatkulRecomendationWithMatkulAndDosen(
        rawMatkulRecomendation: MatkulRecomendationWithMatkulAndDosen[],
    ): MatkulRecomendation {
        const matkulRecomendation: MatkulRecomendation =
            rawMatkulRecomendation.map((r) => {
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

        return matkulRecomendation;
    }
}
