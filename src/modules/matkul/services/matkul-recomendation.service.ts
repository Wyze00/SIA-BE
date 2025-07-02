import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { $Enums, Matkul, RekomendasiMatkul } from '@prisma/client';
import { MatkulRecomendationRequest } from '../dto/requet/recomendation-matkul.dto';
import { RawMatkulRecomendation } from '../dto/types/raw-recomendation.type';
import { MatkulRecomendation } from '../dto/types/matkul-recomendation.type';
import { MatkulIncludeDosen } from '../dto/types/matkul-include-dosen.type';
import { FindAllMatkulRecomendationResponse } from '../dto/response/find-all-recomendation-matkul-response.dto';
import { MatkulRecomendationResponse } from '../dto/response/recomendation-matkul-response.dto';

@Injectable()
export class MatkulRecomendationService {
    constructor(private readonly prismaService: PrismaService) {}

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

    // Logic

    async getInRecomendation(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<MatkulRecomendation> {
        const rawMatkulRecomendation: RawMatkulRecomendation =
            await this.getRawMatkulRecomendation(semester, jurusan);
        return this.formatRawMatkulRecomendation(rawMatkulRecomendation);
    }

    async getNotInRecomendation(
        matkulRecomendation: MatkulRecomendation,
    ): Promise<MatkulRecomendation> {
        const allMatkulIncludeDosen: MatkulIncludeDosen[] =
            await this.getAllMatkulIncludeDosen();
        const filteredMatkulIncludeDosen: MatkulIncludeDosen[] =
            this.filterAllMatkulIncludeDosen(
                allMatkulIncludeDosen,
                matkulRecomendation,
            );
        return this.formatAllMatkulIncludeDosen(filteredMatkulIncludeDosen);
    }

    // Filter & Formatting

    filterAllMatkulIncludeDosen(
        matkulIncludeDosen: MatkulIncludeDosen[],
        matkulRecomendation: MatkulRecomendation,
    ): MatkulIncludeDosen[] {
        return matkulIncludeDosen.filter(
            (matkul) =>
                !matkulRecomendation.find(
                    (r) => r.kode_matkul === matkul.kode_matkul,
                ),
        );
    }

    formatAllMatkulIncludeDosen(
        matkulIncludeDosen: MatkulIncludeDosen[],
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

    formatRawMatkulRecomendation(
        rawMatkulRecomendation: RawMatkulRecomendation,
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

    // Core

    async add(
        request: MatkulRecomendationRequest,
    ): Promise<MatkulRecomendationResponse> {
        await this.ensureMatkulExists(request.kode_matkul);
        await this.ensureRecomendationMatkulNotExist(request);
        return await this.create(request);
    }

    async remove(request: MatkulRecomendationRequest): Promise<boolean> {
        console.log('hadir');
        await this.ensureMatkulExists(request.kode_matkul);
        await this.ensureRecomendationMatkulExist(request);
        return await this.delete(request);
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

    async create(
        data: MatkulRecomendationRequest,
    ): Promise<MatkulRecomendationRequest> {
        const matkul: RekomendasiMatkul =
            await this.prismaService.rekomendasiMatkul.create({
                data,
            });

        return matkul;
    }

    async delete(data: MatkulRecomendationRequest): Promise<boolean> {
        await this.prismaService.rekomendasiMatkul.deleteMany({
            where: data,
        });

        return true;
    }

    async getRawMatkulRecomendation(
        semester: number,
        jurusan: $Enums.Jurusan,
    ): Promise<RawMatkulRecomendation> {
        const rawRecomendation: RawMatkulRecomendation =
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

    async getAllMatkulIncludeDosen(): Promise<MatkulIncludeDosen[]> {
        const matkulAndDosen: MatkulIncludeDosen[] =
            await this.prismaService.matkul.findMany({
                include: { dosen: true },
            });

        return matkulAndDosen;
    }
}
