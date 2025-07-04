import { MahasiswaNilaiMatkulResponse } from './mahasiswa-nilai-matkul-response.dto';

export class FindAllMahasiswaNilaiMatkulResponse {
    allMatkul: MahasiswaNilaiMatkulResponse[];
    summary: {
        average: number;
        nilai_huruf: string;
    };
}
