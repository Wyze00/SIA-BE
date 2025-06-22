import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class LoginUserResponse {
    @ApiProperty({
        type: String,
        example: 'JWT Token',
    })
    token: string;
    @ApiProperty({
        type: String,
        example: 'IF1125001',
    })
    id: string;

    @ApiProperty({
        enum: $Enums.Role,
        example: 'mahasiswa',
    })
    role: $Enums.Role;

    @ApiProperty({
        type: String,
        example: 'asep',
    })
    name: string;
}
