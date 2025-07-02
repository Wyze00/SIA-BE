import { $Enums } from '@prisma/client';

export type RawMatkulRecomendation = ({
    matkul: {
        dosen: {
            name: string;
            nip: string;
        };
    } & {
        kode_matkul: string;
        name: string;
        dosen_nip: string;
        total_pertemuan: number;
        total_sks: number;
    };
} & {
    kode_matkul: string;
    semester: number;
    jurusan: $Enums.Jurusan;
})[];
