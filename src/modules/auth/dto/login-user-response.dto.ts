import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user-response.dto';

export class LoginUserResponse extends UserResponse {
    @ApiProperty({
        type: String,
        example: 'JWT Token',
    })
    token: string;
}
