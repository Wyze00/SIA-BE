import { MhsNilaiMatkul } from '@prisma/client';

export class FindAllMahasiswaNilaiMatkulResponse {
    allMatkul: MhsNilaiMatkul[];
    summary: {
        average: number;
        nilai_huruf: string;
    };
}
