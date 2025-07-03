import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { CreateMahasiswaRequest } from '.././dto/create-mahasiswa.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaService } from '../services/mahasiswa.service';
import { MahasiswaResponse } from '../dto/mahasiswa-response.dto';
import { UpdateMahasiswaRequest } from '../dto/update-mahasiswa-request.dto';
import { User } from 'src/common/decorator/user.decorator';
import { UserRole } from 'src/common/dto/user-role.dto';
import { $Enums } from '@prisma/client';

@Controller('mahasiswa')
export class MahasiswaController {
    constructor(private readonly mahasiswaService: MahasiswaService) {}

    @ApiBody({
        type: CreateMahasiswaRequest,
    })
    @ApiCreatedResponse({
        type: MahasiswaResponse,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async create(
        @Body() request: CreateMahasiswaRequest,
    ): Promise<MahasiswaResponse> {
        return await this.mahasiswaService.create(request);
    }

    @ApiBody({
        type: UpdateMahasiswaRequest,
    })
    @ApiOkResponse({
        type: MahasiswaResponse,
    })
    @ApiBearerAuth()
    @Put('/:nim')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async update(
        @Param('nim') nim: string,
        @Body() request: UpdateMahasiswaRequest,
    ): Promise<MahasiswaResponse> {
        return await this.mahasiswaService.update(request, nim);
    }

    @ApiOkResponse({
        type: MahasiswaResponse,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('mahasiswa')
    @UseGuards(JwtGuard)
    async findOne(@User() user: UserRole): Promise<MahasiswaResponse> {
        return await this.mahasiswaService.findOne(user.id);
    }

    @ApiOkResponse({
        type: [MahasiswaResponse],
    })
    @ApiBearerAuth()
    @Get('/admin')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async findAll(
        @Query('jurusan') jurusan?: $Enums.Jurusan,
        @Query('semester') semester?: number,
        @Query('angkatan') angkatan?: string,
    ): Promise<MahasiswaResponse[]> {
        return await this.mahasiswaService.findAll(jurusan, semester, angkatan);
    }

    @ApiOkResponse({
        type: MahasiswaResponse,
    })
    @ApiBearerAuth()
    @Get('/:nim')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async findOneByNim(@Param('nim') nim: string): Promise<MahasiswaResponse> {
        return await this.mahasiswaService.findOne(nim);
    }

    @ApiBearerAuth()
    @Delete('/:nim')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async remove(@Param('nim') nim: string): Promise<void> {
        return await this.mahasiswaService.remove(nim);
    }
}
