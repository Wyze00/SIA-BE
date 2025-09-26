import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { UserWithDosen } from './dto/types/user-with-dosen.type';
import * as bcrypt from 'bcrypt';
import { Dosen } from '@prisma/client';
import { UpdateDosenRequest } from './dto/update-dosen-request.dto';

@Injectable()
export class DosenRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async insert(request: CreateDosenRequest): Promise<UserWithDosen> {
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

    async getByNIP(nip: string): Promise<Dosen | null> {
        return await this.prismaService.dosen.findUnique({
            where: {
                nip,
            },
        });
    }

    async getAll(): Promise<Dosen[]> {
        return await this.prismaService.dosen.findMany();
    }

    async update(
        nip: string,
        request: UpdateDosenRequest,
    ): Promise<UserWithDosen> {
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

        return userWithDosen;
    }

    async deleteByNIP(nip: string): Promise<void> {
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
}
