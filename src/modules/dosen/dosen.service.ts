import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { DosenResponse } from './dto/dosen-response.dto';
import * as bcrypt from 'bcrypt';
import { UpdateDosenRequest } from './dto/update-dosen-request.dto';
import { Dosen } from '@prisma/client';
import { UserWithDosen } from './dto/types/user-with-dosen.type';

@Injectable()
export class DosenService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(request: CreateDosenRequest): Promise<DosenResponse> {
        await this.ensureDosenNotExistsOrThrow(request.id);

        const userWithDosen: UserWithDosen =
            await this.createUserWithDosen(request);

        return this.toDosenResponse(userWithDosen.dosen!);
    }

    async update(
        nip: string,
        request: UpdateDosenRequest,
    ): Promise<DosenResponse> {
        await this.ensureDosenExistsOrThrow(nip);

        if (nip != request.nip) {
            await this.ensureDosenNotExistsOrThrow(nip);
        }

        const userWithDosen: UserWithDosen =
            await this.prismaService.user.update({
                where: {
                    id: nip,
                },
                data: {
                    id: request.nip,
                    name: request.name,
                    dosen: {
                        update: {
                            data: {
                                name: request.name,
                            },
                        },
                    },
                },
                include: {
                    dosen: true,
                },
            });

        return this.toDosenResponse(userWithDosen.dosen!);
    }

    async findOne(nip: string): Promise<DosenResponse> {
        const dosen: Dosen = await this.ensureDosenExistsOrThrow(nip);
        return this.toDosenResponse(dosen);
    }

    async findAll(): Promise<DosenResponse[]> {
        const dosen: Dosen[] = await this.prismaService.dosen.findMany();
        return dosen.map((d) => this.toDosenResponse(d));
    }

    async remove(nip: string): Promise<void> {
        await this.ensureDosenExistsOrThrow(nip);

        await this.prismaService.$transaction([
            this.prismaService.dosen.delete({
                where: {
                    nip: nip,
                },
            }),
            this.prismaService.user.delete({
                where: {
                    id: nip,
                },
            }),
        ]);
    }

    async createUserWithDosen(
        request: CreateDosenRequest,
    ): Promise<UserWithDosen> {
        const userWithDosen: UserWithDosen =
            await this.prismaService.user.create({
                data: {
                    id: request.id,
                    name: request.name,
                    role: 'dosen',
                    password: await bcrypt.hash(request.password, 10),
                    dosen: {
                        create: {
                            name: request.name,
                        },
                    },
                },
                include: {
                    dosen: true,
                },
            });

        return userWithDosen;
    }

    // Validaion

    async ensureDosenExistsOrThrow(nip: string): Promise<Dosen> {
        const dosen: Dosen | null = await this.prismaService.dosen.findUnique({
            where: {
                nip,
            },
        });

        if (dosen == null) {
            throw new NotFoundException('Dosen Tidak Ditemukan');
        }

        return dosen;
    }

    async ensureDosenNotExistsOrThrow(nip: string): Promise<void> {
        const dosen: Dosen | null = await this.prismaService.dosen.findUnique({
            where: {
                nip,
            },
        });

        if (dosen) {
            throw new ConflictException('Dosen Sudah Ada');
        }
    }

    // Mapper

    toDosenResponse(dosen: Dosen): DosenResponse {
        return {
            name: dosen.name,
            nip: dosen.nip,
        };
    }
}
