import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsString, Length } from 'class-validator';

export class RegisterUserRequest {
    @ApiProperty({
        type: String,
        example: 'IF1125001',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    id: string;

    @ApiProperty({
        type: String,
        example: 'rahaia123',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Length(1, 100)
    password: string;

    @ApiProperty({
        enum: $Enums.Role,
        example: 'mahasiswa',
    })
    @IsEnum($Enums.Role)
    role: $Enums.Role;

    @ApiProperty({
        type: String,
        example: 'asep',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Length(1, 100)
    name: string;
}
