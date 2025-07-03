import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';

@Injectable()
export class MahasiswaTotalNilaiService {
    constructor(private readonly prismaService: PrismaService) {}

    async init(nim: string): Promise<void> {
        for (let semester = 1; semester <= 8; semester++) {
            await this.prismaService.mhsTotalNilai.create({
                data: {
                    nim,
                    ips: 0,
                    semester,
                    total_sks: 0,
                },
            });
        }
    }

    async remove(nim: string): Promise<void> {
        await this.prismaService.mhsTotalNilai.deleteMany({
            where: {
                nim,
            },
        });
    }

    async incremenetSKS(
        nim: string,
        semester: number,
        sks: number,
    ): Promise<void> {
        await this.prismaService.mhsTotalNilai.update({
            where: {
                nim_semester: {
                    nim,
                    semester,
                },
            },
            data: {
                total_sks: {
                    increment: sks,
                },
            },
        });
    }

    async decrementSKS(
        nim: string,
        semester: number,
        sks: number,
    ): Promise<void> {
        await this.prismaService.mhsTotalNilai.update({
            where: {
                nim_semester: {
                    nim,
                    semester,
                },
            },
            data: {
                total_sks: {
                    decrement: sks,
                },
            },
        });
    }

    async updateIps(nim: string, semester: number, ips: number): Promise<void> {
        await this.prismaService.mhsTotalNilai.update({
            where: {
                nim_semester: {
                    nim,
                    semester,
                },
            },
            data: {
                ips,
            },
        });
    }
}
