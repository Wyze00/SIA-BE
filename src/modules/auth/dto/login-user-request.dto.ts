import { IsString, Length } from 'class-validator';

export class LoginUserRequest {
    @IsString()
    @Length(1, 10)
    id: string;

    @IsString()
    @Length(1, 100)
    password: string;
}
