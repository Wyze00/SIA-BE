import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateMatkulRequest } from '../dto/request/create-matkul-request.dto';
import { UpdateMatkulRequest } from '../dto/request/update-matkul.dto-request';
import { PrismaService } from 'src/common/provider/prisma.service';
import { Matkul } from '@prisma/client';
import { MatkulResponse } from '../dto/response/matkul-reesponse.dto';
import { DosenService } from 'src/modules/dosen/dosen.service';
import { MatkulWithDosen } from '../dto/types/matkul-include-dosen.type';

@Injectable()
export class MatkulService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly dosenService: DosenService,
    ) {}

    // Core

    async create(request: CreateMatkulRequest): Promise<MatkulResponse> {
        await this.dosenService.ensureDosenExistsOrThrow(request.dosen_nip);
        await this.ensureMatkulNotExistsOrThrow(request.kode_matkul);
        const matkul: MatkulWithDosen = await this.prismaService.matkul.create({
            data: request,
            include: {
                dosen: true,
            },
        });
        return this.formatMatkulWithDosenToMatkulResponse(matkul);
    }

    async findAll(): Promise<MatkulResponse[]> {
        const matkul: MatkulWithDosen[] = await this.getAllMatkulWithDosen();
        return matkul.map((m) => this.formatMatkulWithDosenToMatkulResponse(m));
    }

    async findOne(kode_matkul: string): Promise<MatkulResponse> {
        const matkul: MatkulWithDosen =
            await this.ensureMatkulExistsOrThrow(kode_matkul);
        return this.formatMatkulWithDosenToMatkulResponse(matkul);
    }

    async update(
        kode_matkul: string,
        request: UpdateMatkulRequest,
    ): Promise<MatkulResponse> {
        await this.ensureMatkulExistsOrThrow(kode_matkul);
        const matkul: MatkulWithDosen = await this.prismaService.matkul.update({
            where: {
                kode_matkul,
            },
            data: request,
            include: {
                dosen: true,
            },
        });
        return this.formatMatkulWithDosenToMatkulResponse(matkul);
    }

    async remove(kode_matkul: string): Promise<void> {
        await this.ensureMatkulExistsOrThrow(kode_matkul);
        await this.prismaService.matkul.delete({
            where: {
                kode_matkul,
            },
        });
    }

    // CRUD

    async getAllMatkulWithDosen(): Promise<MatkulWithDosen[]> {
        const matkulAndDosen: MatkulWithDosen[] =
            await this.prismaService.matkul.findMany({
                include: { dosen: true },
            });

        return matkulAndDosen;
    }

    async getAllMatkulWithDosenByNotInKodeMakul(
        kode_matkul: string[],
    ): Promise<MatkulWithDosen[]> {
        const matkulAndDosen: MatkulWithDosen[] =
            await this.prismaService.matkul.findMany({
                where: {
                    kode_matkul: {
                        notIn: kode_matkul,
                    },
                },
                include: { dosen: true },
            });

        return matkulAndDosen;
    }

    // Validation

    async ensureMatkulExistsOrThrow(
        kode_matkul: string,
    ): Promise<MatkulWithDosen> {
        const matkul: MatkulWithDosen | null =
            await this.prismaService.matkul.findUnique({
                where: {
                    kode_matkul,
                },
                include: {
                    dosen: true,
                },
            });

        if (matkul == null) {
            throw new NotFoundException('Matkul Tidak Ditemukan');
        }

        return matkul;
    }

    async ensureMatkulNotExistsOrThrow(kode_matkul: string): Promise<void> {
        const matkul: Matkul | null =
            await this.prismaService.matkul.findUnique({
                where: {
                    kode_matkul,
                },
            });

        if (matkul) {
            throw new ConflictException('Matkul Sudah Ada');
        }
    }

    // Mapping

    formatMatkulWithDosenToMatkulResponse(
        matkul: MatkulWithDosen,
    ): MatkulResponse {
        return {
            kode_matkul: matkul.kode_matkul,
            dosen_nip: matkul.dosen_nip,
            name: matkul.name,
            total_pertemuan: matkul.total_pertemuan,
            total_sks: matkul.total_sks,
            dosen_name: matkul.dosen.name,
        };
    }
}
