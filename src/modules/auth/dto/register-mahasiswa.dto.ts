import { IsEnum, IsInt, IsPositive, Max } from 'class-validator';
import { RegisterUserRequest } from './register-user-request.dto';
import { $Enums } from '@prisma/client';

export class RegisterMahasiswaRequest extends RegisterUserRequest {
    @IsEnum($Enums.Jurusan)
    jurusan: $Enums.Jurusan;

    @IsInt()
    @IsPositive()
    @Max(8)
    semester: number;
}
