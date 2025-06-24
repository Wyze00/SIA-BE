import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
    IsEnum,
    IsInt,
    IsPositive,
    IsString,
    Length,
    Max,
} from 'class-validator';

export class MahasiswaRespone {
    @ApiProperty({
        type: String,
        example: 'IF1125001',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    nim: string;

    @ApiProperty({
        type: String,
        example: 'Asep',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiProperty({
        enum: $Enums.Jurusan,
        example: 'olb',
    })
    @IsEnum($Enums.Jurusan)
    jurusan: $Enums.Jurusan;

    @ApiProperty({
        type: Number,
        example: 1,
        minimum: 1,
        maximum: 8,
    })
    @IsInt()
    @IsPositive()
    @Max(8)
    semester: number;

    @ApiProperty({
        type: String,
        minLength: 4,
        maxLength: 4,
        example: '2025',
    })
    @IsString()
    @Length(4, 4)
    angkatan: string;
}
