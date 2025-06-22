import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { CreatMahasiswaRequest } from './dto/create-mahasiswa.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaService } from './mahasiswa.service';
import { MahasiswaRespone } from './dto/mahasiswa-response.dto';

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
}
