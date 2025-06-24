import { ApiProperty } from '@nestjs/swagger';
import { Dosen } from '@prisma/client';
import { IsString, Length } from 'class-validator';

export class DosenResponse implements Dosen {
    @ApiProperty({
        type: String,
        example: 'DSN5525001',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    nip: string;

    @ApiProperty({
        type: String,
        example: 'Asep',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Length(1, 100)
    name: string;
}
