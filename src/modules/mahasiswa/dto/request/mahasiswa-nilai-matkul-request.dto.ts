import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsPositive, Max } from 'class-validator';

export class UpdateMahasiswaNilaiMatkulRequestBody {
    @IsNumber()
    @IsPositive()
    @Max(100)
    nilai: number;

    @IsEnum($Enums.TipeNilaiMatkul)
    tipe: $Enums.TipeNilaiMatkul;
}
