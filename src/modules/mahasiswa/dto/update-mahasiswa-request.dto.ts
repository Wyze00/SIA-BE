import { ApiProperty } from '@nestjs/swagger';
import { MahasiswaRespone } from './mahasiswa-response.dto';
import { IsString, Length } from 'class-validator';

export class UpdateMahasiswaRequest extends MahasiswaRespone {
    @ApiProperty({
        type: String,
        example: 'IF1125002',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    newNim: string;
}
