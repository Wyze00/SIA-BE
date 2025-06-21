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
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { LoginUserResponse } from './dto/login-user-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({
        type: RegisterMahasiswaRequest,
    })
    @ApiCreatedResponse({
        type: UserResponse,
    })
    @ApiBearerAuth()
    @Post('/register/mahasiswa')
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async createMahasiswa(
        @Body() request: RegisterMahasiswaRequest,
    ): Promise<UserResponse> {
        return await this.authService.createMahasiswa(request);
    }

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
}
