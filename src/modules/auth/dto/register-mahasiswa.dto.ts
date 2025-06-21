import { IsEnum, IsInt, IsPositive, Max } from 'class-validator';
import { RegisterUserRequest } from './register-user-request.dto';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMahasiswaRequest extends RegisterUserRequest {
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
}
