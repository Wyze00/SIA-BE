import { $Enums } from '@prisma/client';
import { IsEnum, IsString, Length } from 'class-validator';

export class RegisterUserRequest {
    @IsString()
    @Length(1, 10)
    id: string;

    @IsString()
    @Length(1, 100)
    password: string;

    @IsEnum($Enums.Role)
    role: $Enums.Role;

    @IsString()
    @Length(1, 100)
    name: string;
}
