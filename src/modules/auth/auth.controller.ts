import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RegisterMahasiswaRequest } from './dto/register-mahasiswa.dto';
import { UserResponse } from './dto/user-response.dto';
import { LoginUserRequest } from './dto/login-user-request.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register/mahasiswa')
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async createMahasiswa(
        @Body() request: RegisterMahasiswaRequest,
    ): Promise<UserResponse> {
        return await this.authService.createMahasiswa(request);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginUserRequest): Promise<UserResponse> {
        return await this.authService.login(request);
    }
}
