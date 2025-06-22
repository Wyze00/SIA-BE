import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequest } from './dto/login-user-request.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginUserResponse } from './dto/login-user-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({
        type: LoginUserRequest,
    })
    @ApiOkResponse({
        type: LoginUserResponse,
    })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginUserRequest): Promise<LoginUserResponse> {
        return await this.authService.login(request);
    }

    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout() {}
}
