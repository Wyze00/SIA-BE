import { $Enums, Mahasiswa } from '@prisma/client';

export class MahasiswaRespone implements Mahasiswa {
    nim: string;
    name: string;
    jurusan: $Enums.Jurusan;
    semester: number;
}
