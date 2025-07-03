import { $Enums, MhsNilaiMatkul } from '@prisma/client';

export class MahasiswaNilaiMatkulResponse implements MhsNilaiMatkul {
    bobot: number;
    kode_matkul: string;
    nilai: number;
    nim: string;
    semester: number;
    tipe: $Enums.TipeNilaiMatkul;
}
