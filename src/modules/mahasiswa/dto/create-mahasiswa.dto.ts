import { IsEnum, IsInt, IsPositive, Max } from 'class-validator';
import { $Enums } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest } from '../../auth/dto/create-user-request.dto';

export class CreatMahasiswaRequest extends CreateUserRequest {
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
