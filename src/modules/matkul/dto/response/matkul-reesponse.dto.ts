import { ApiProperty } from '@nestjs/swagger';
import { Matkul } from '@prisma/client';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class MatkulResponse implements Matkul {
    @ApiProperty({
        type: String,
        example: 'IF-101',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    kode_matkul: string;

    @ApiProperty({
        type: String,
        example: 'DSN5525001',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    dosen_nip: string;

    @ApiProperty({
        type: String,
        example: 'Algoritma Pemograman Dasar',
        minLength: 1,
        maxLength: 50,
    })
    @IsString()
    @Length(1, 50)
    name: string;

    @ApiProperty({
        type: Number,
        example: 14,
        minimum: 1,
    })
    @IsNumber()
    @IsPositive()
    total_pertemuan: number;

    @ApiProperty({
        type: Number,
        example: 3,
        minimum: 1,
    })
    @IsNumber()
    @IsPositive()
    total_sks: number;

    @ApiProperty({
        type: String,
        example: 'Budi Susanto',
        minLength: 1,
        maxLength: 50,
    })
    @IsString()
    @Length(1, 50)
    dosen_name: string;
}
