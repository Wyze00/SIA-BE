import { Injectable, NotFoundException } from '@nestjs/common';
import {
    MhsMengabsenMatkul,
    MhsMengambilMatkul,
    MhsNilaiMatkul,
} from '@prisma/client';
import { PrismaService } from 'src/common/provider/prisma.service';
import { MahasiswaTotalNilaiService } from './mahasiswa-total-nilai.service';

@Injectable()
export class MahasiswaAmbilMatkulService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mahasiswaTotalNilaiService: MahasiswaTotalNilaiService,
    ) {}

    async create(nim: string, kode_matkul: string, semester: number) {
        await this.prismaService.mhsMengambilMatkul.create({
            data: {
                semester,
                status: 'diambil',
                kode_matkul,
                nim,
                nilai_huruf: '-',
                nilai: 0,
                persen_absensi: 0,
            },
        });
    }

    async updateNilai(nim: string, kode_matkul: string, semester: number) {
        const allNilaiMatkul: MhsNilaiMatkul[] =
            await this.prismaService.mhsNilaiMatkul.findMany({
                where: {
                    nim,
                    kode_matkul,
                    semester,
                },
            });

        const nilai: number = allNilaiMatkul.reduce(
            (a, c) => a + c.nilai * (c.bobot / 100),
            0,
        );
        const nilai_huruf = this.toNilaiHuruf(nilai);

        await this.prismaService.mhsMengambilMatkul.update({
            where: {
                kode_matkul_nim_semester: {
                    nim,
                    kode_matkul,
                    semester,
                },
            },
            data: {
                nilai,
                nilai_huruf,
            },
        });

        await this.mahasiswaTotalNilaiService.updateIps(nim, semester);
    }

    async updateAbsen(nim: string, kode_matkul: string, semester: number) {
        const allAbsenMatkul: MhsMengabsenMatkul[] =
            await this.prismaService.mhsMengabsenMatkul.findMany({
                where: {
                    nim,
                    kode_matkul,
                    semester,
                },
            });

        const hadir: number = allAbsenMatkul.filter(
            (a) => a.status == 'hadir',
        ).length;
        const persen_absensi: number = (hadir / allAbsenMatkul.length) * 100;

        await this.prismaService.mhsMengambilMatkul.update({
            where: {
                kode_matkul_nim_semester: {
                    nim,
                    kode_matkul,
                    semester,
                },
            },
            data: {
                persen_absensi,
            },
        });
    }

    // Validation

    async ensureMahasiswaMengambilMatkulExistsOrThrow(
        nim: string,
        kode_matkul: string,
        semester: number,
    ): Promise<MhsMengambilMatkul> {
        const matkul: MhsMengambilMatkul | null =
            await this.prismaService.mhsMengambilMatkul.findUnique({
                where: {
                    kode_matkul_nim_semester: {
                        nim,
                        kode_matkul,
                        semester,
                    },
                },
            });

        if (matkul == null) {
            throw new NotFoundException('Mahasiswa Tidak Mengambil Matkul Ini');
        }

        return matkul;
    }

    // Mapper

    toNilaiHuruf(nilai: number): string {
        if (nilai >= 80) {
            return 'A';
        } else if (nilai >= 70) {
            return 'B';
        } else if (nilai >= 60) {
            return 'C';
        } else if (nilai >= 50) {
            return 'D';
        } else {
            return 'E';
        }
    }
}
