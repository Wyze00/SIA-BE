import { ApiProperty } from '@nestjs/swagger';
import { MatkulRecomendationMahasiswaRequest } from './matkul-recomendation-mahasiswa-request.dto';
import { IsString, Length } from 'class-validator';

export class UpdateMatkulRecomendationMahasiswaRequest extends MatkulRecomendationMahasiswaRequest {
    @ApiProperty({
        type: String,
        example: 'IF-101',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    kode_matkul: string;
}
