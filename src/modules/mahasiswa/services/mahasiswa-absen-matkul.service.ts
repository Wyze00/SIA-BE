import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaService } from './mahasiswa.service';
import { MatkulService } from 'src/modules/matkul/services/matkul.service';

@Injectable()
export class MahasiswaAbsenMatkulService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => MahasiswaService))
        private readonly mahasiswaService: MahasiswaService,
        @Inject(forwardRef(() => MatkulService))
        private readonly matkulService: MatkulService,
    ) {}

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

    async findAll(nim: string, semester: number, kode_matkul: string) {
        await this.mahasiswaService.ensureMahasiswaExistsOrThrow(nim);
        await this.matkulService.ensureMatkulExistsOrThrow(kode_matkul);

        return await this.prismaService.mhsMengabsenMatkul.findMany({
            where: {
                nim,
                semester,
                kode_matkul,
            },
        });
    }
}
