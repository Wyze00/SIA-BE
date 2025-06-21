import { UserResponse } from './user-response.dto';

export class LoginUserResponse extends UserResponse {
    token: string;
}
