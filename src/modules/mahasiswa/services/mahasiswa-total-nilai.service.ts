import { Injectable } from '@nestjs/common';
import { MhsTotalNilai } from '@prisma/client';
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

    async updateIps(nim: string, semester: number): Promise<void> {
        const mhsTotalNilai: MhsTotalNilai =
            (await this.prismaService.mhsTotalNilai.findUnique({
                where: {
                    nim_semester: {
                        nim,
                        semester,
                    },
                },
            }))!;

        const mhsAmbilMatkul =
            await this.prismaService.mhsMengambilMatkul.findMany({
                where: {
                    nim,
                    semester,
                },
                include: {
                    matkul: true,
                },
            });

        const sumNA: number = mhsAmbilMatkul.reduce(
            (a, c) =>
                a + this.nilaiHurufToNA(c.nilai_huruf) * c.matkul.total_sks,
            0,
        );

        await this.prismaService.mhsTotalNilai.update({
            where: {
                nim_semester: {
                    nim,
                    semester,
                },
            },
            data: {
                ips: sumNA / mhsTotalNilai.total_sks,
            },
        });
    }

    async findOne(nim: string, semester: number): Promise<MhsTotalNilai> {
        return (await this.prismaService.mhsTotalNilai.findUnique({
            where: {
                nim_semester: {
                    nim,
                    semester,
                },
            },
        }))!;
    }

    // Mapper

    nilaiHurufToNA(nilai_huruf: string): number {
        if (nilai_huruf == 'A') {
            return 4;
        } else if (nilai_huruf == 'B') {
            return 3;
        } else if (nilai_huruf == 'C') {
            return 2;
        } else if (nilai_huruf == 'D') {
            return 1;
        } else {
            return 0;
        }
    }
}
