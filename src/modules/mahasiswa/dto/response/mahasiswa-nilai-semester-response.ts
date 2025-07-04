import { MahasiswaNilaiSemester } from '../types/mahasiswa-nilai-semester.type';

export class MahasiswaNilaiSemesterResponse {
    allMatkul: MahasiswaNilaiSemester[];
    summary: {
        ips: number;
        total_sks: number;
    };
}
