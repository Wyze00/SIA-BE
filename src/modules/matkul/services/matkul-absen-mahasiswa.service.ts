import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';

@Injectable()
export class MatkulAbsenMahasiswaService {
    constructor(private readonly prismaService: PrismaService) {}

    async init(
        nim: string,
        semester: number,
        kode_matkul: string,
        total_pertemuan: number,
    ) {
        for (let pertemuan = 1; pertemuan <= total_pertemuan; pertemuan++) {
            await this.prismaService.mhsMengabsenMatkul.create({
                data: {
                    pertemuan,
                    semester,
                    nim,
                    kode_matkul,
                    status: 'none',
                },
            });
        }
    }

    async removeOne(
        nim: string,
        semester: number,
        kode_matkul: string,
    ): Promise<void> {
        await this.prismaService.mhsMengabsenMatkul.deleteMany({
            where: {
                nim,
                semester,
                kode_matkul,
            },
        });
    }

    async removeAll(nim: string): Promise<void> {
        await this.prismaService.mhsMengabsenMatkul.deleteMany({
            where: {
                nim,
            },
        });
    }
}
