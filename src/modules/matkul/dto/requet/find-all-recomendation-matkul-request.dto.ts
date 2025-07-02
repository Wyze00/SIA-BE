import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, Max } from 'class-validator';

export class FindAllMatkulRecomendationRequest {
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
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Max(8)
    semester: number;
}
