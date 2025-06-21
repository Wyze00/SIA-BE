import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUserRequest {
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
        example: 'rahasia123',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @Length(1, 100)
    password: string;
}
