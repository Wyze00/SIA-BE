import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { CreatMahasiswaRequest } from './dto/create-mahasiswa.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaService } from './mahasiswa.service';
import { MahasiswaRespone } from './dto/mahasiswa-response.dto';
import { UpdateMahasiswaRequest } from './dto/update-mahasiswa-request.dto';
import { User } from 'src/common/decorator/user.decorator';
import { UserRole } from 'src/common/dto/user-role.dto';

@Controller('mahasiswa')
export class MahasiswaController {
    constructor(private readonly mahasiswaService: MahasiswaService) {}

    @ApiBody({
        type: CreatMahasiswaRequest,
    })
    @ApiCreatedResponse({
        type: MahasiswaRespone,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async createMahasiswa(
        @Body() request: CreatMahasiswaRequest,
    ): Promise<MahasiswaRespone> {
        return await this.mahasiswaService.createMahasiswa(request);
    }

    @ApiBody({
        type: UpdateMahasiswaRequest,
    })
    @ApiOkResponse({
        type: MahasiswaRespone,
    })
    @ApiBearerAuth()
    @Put()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async updateMahasiswa(
        @Body() request: UpdateMahasiswaRequest,
    ): Promise<MahasiswaRespone> {
        return await this.mahasiswaService.updateMahasiswa(request);
    }

    @ApiOkResponse({
        type: MahasiswaRespone,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('mahasiswa')
    @UseGuards(JwtGuard)
    async findMahasiswa(@User() user: UserRole): Promise<MahasiswaRespone> {
        return await this.mahasiswaService.findMahasiswa(user.id);
    }
}
