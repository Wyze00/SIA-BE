import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreateMahasiswaRequest } from '../dto/request/create-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { MahasiswaResponse } from '../dto/response/mahasiswa-response.dto';
import { UpdateMahasiswaRequest } from '../dto/request/update-mahasiswa-request.dto';
import { $Enums, Mahasiswa } from '@prisma/client';
import { UserWithMahasiswa } from '../dto/types/user-with-mahasiswa.types';
import { MahasiswaTotalNilaiService } from './mahasiswa-total-nilai.service';
import { MatkulRecomendationMahasiswaService } from 'src/modules/matkul/services/matkul-recomendation-mahasiswa.service';

@Injectable()
export class MahasiswaService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mahasiswaTotalNilaiService: MahasiswaTotalNilaiService,
        @Inject(forwardRef(() => MatkulRecomendationMahasiswaService))
        private readonly matkulRecomendationMahasiswaService: MatkulRecomendationMahasiswaService,
    ) {}

    // Core

    async remove(nim: string): Promise<void> {
        await this.ensureMahasiswaExistsOrThrow(nim);
        await this.matkulRecomendationMahasiswaService.removeAll(nim);
        await this.mahasiswaTotalNilaiService.remove(nim);
        await this.removeMahasiswaAndUser(nim);
    }

    async findOne(nim: string): Promise<MahasiswaResponse> {
        const mahasiswa: Mahasiswa =
            await this.ensureMahasiswaExistsOrThrow(nim);
        return this.toMahasiswaResponse(mahasiswa);
    }

    async findAll(
        jurusan?: $Enums.Jurusan,
        semester?: number,
        angkatan?: string,
    ): Promise<MahasiswaResponse[]> {
        const query: Record<string, any>[] = this.applyQueryFilter(
            jurusan,
            angkatan,
            semester,
        );

        const mahasiswa: Mahasiswa[] =
            await this.prismaService.mahasiswa.findMany({
                where: {
                    AND: query,
                },
            });

        return mahasiswa.map((m) => this.toMahasiswaResponse(m));
    }

    async update(
        request: UpdateMahasiswaRequest,
        nim: string,
    ): Promise<MahasiswaResponse> {
        await this.ensureMahasiswaExistsOrThrow(nim);

        if (nim != request.nim) {
            await this.ensureMahasiswaNotExistsOrThrow(request.nim);
        }

        const userWithMahasiswa: UserWithMahasiswa =
            await this.prismaService.user.update({
                where: {
                    id: nim,
                },
                data: {
                    id: request.nim,
                    name: request.name,
                    mahasiswa: {
                        update: {
                            data: {
                                name: request.name,
                                jurusan: request.jurusan,
                                semester: request.semester,
                                angkatan: request.angkatan,
                            },
                        },
                    },
                },
                include: {
                    mahasiswa: true,
                },
            });

        return this.toMahasiswaResponse(userWithMahasiswa.mahasiswa!);
    }

    async create(request: CreateMahasiswaRequest): Promise<MahasiswaResponse> {
        await this.ensureMahasiswaNotExistsOrThrow(request.id);

        const userWithMahasiswa: UserWithMahasiswa =
            await this.createUserAndMahasiswa(request);

        await this.mahasiswaTotalNilaiService.init(request.id);
        return this.toMahasiswaResponse(userWithMahasiswa.mahasiswa!);
    }

    private async createUserAndMahasiswa(
        request: CreateMahasiswaRequest,
    ): Promise<UserWithMahasiswa> {
        return this.prismaService.user.create({
            data: {
                id: request.id,
                name: request.name,
                role: 'mahasiswa',
                password: await bcrypt.hash(request.password, 10),
                mahasiswa: {
                    create: {
                        name: request.name,
                        jurusan: request.jurusan,
                        semester: request.semester,
                        angkatan: request.angkatan,
                    },
                },
            },
            include: {
                mahasiswa: true,
            },
        });
    }

    async removeMahasiswaAndUser(nim: string): Promise<void> {
        await this.prismaService.mahasiswa.delete({
            where: {
                nim: nim,
            },
        });
        await this.prismaService.user.delete({
            where: {
                id: nim,
            },
        });
    }

    // Validation

    async ensureMahasiswaExistsOrThrow(nim: string): Promise<Mahasiswa> {
        const mahasiswa: Mahasiswa | null =
            await this.prismaService.mahasiswa.findUnique({
                where: {
                    nim: nim,
                },
            });

        if (mahasiswa == null) {
            throw new NotFoundException('Mahasiswa Tidak Ditemukan');
        }

        return mahasiswa;
    }

    async ensureMahasiswaNotExistsOrThrow(nim: string): Promise<void> {
        const mahasiswa: Mahasiswa | null =
            await this.prismaService.mahasiswa.findUnique({
                where: {
                    nim: nim,
                },
            });

        if (mahasiswa) {
            throw new ConflictException('Mahasiswa Sudah Ada');
        }
    }

    // Map

    toMahasiswaResponse(mahasiswa: Mahasiswa): MahasiswaResponse {
        return {
            angkatan: mahasiswa.angkatan,
            jurusan: mahasiswa.jurusan,
            name: mahasiswa.name,
            nim: mahasiswa.nim,
            semester: mahasiswa.semester,
        };
    }

    applyQueryFilter(
        jurusan?: $Enums.Jurusan,
        angkatan?: string,
        semester?: number,
    ): Record<string, any>[] {
        const query: Record<string, any>[] = [];

        if (jurusan) {
            query.push({
                jurusan,
            });
        }

        if (semester) {
            query.push({
                semester,
            });
        }

        if (angkatan) {
            query.push({
                angkatan,
            });
        }

        return query;
    }
}
