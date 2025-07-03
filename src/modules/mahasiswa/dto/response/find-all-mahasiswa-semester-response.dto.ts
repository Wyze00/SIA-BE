import { MahasiswaSemester } from './types/mahasiswa-semester.type';

export class FindAllMahaiswaSemesterResponse {
    all: MahasiswaSemester[];
    nilai: {
        ips: number;
        total_sks: number;
    };
}
