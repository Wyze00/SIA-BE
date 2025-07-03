import { MhsNilaiMatkul } from '@prisma/client';

export class FindAllMahasiswaNilaiMatkulResponse {
    all: MhsNilaiMatkul[];
    nilai: {
        average: number;
        nilai_huruf: string;
    };
}
