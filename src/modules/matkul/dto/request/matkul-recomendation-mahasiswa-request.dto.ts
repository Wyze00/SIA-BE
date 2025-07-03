import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, Length, Max } from 'class-validator';

export class MatkulRecomendationMahasiswaRequest {
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
