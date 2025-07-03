import {
    IsEnum,
    IsInt,
    IsPositive,
    IsString,
    Length,
    Max,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest } from '../../../auth/dto/create-user-request.dto';

export class CreateMahasiswaRequest extends CreateUserRequest {
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
