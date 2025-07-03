import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MahasiswaAbsenMatkulService } from '../services/mahasiswa-absen-matkul.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('mahasiswa/absen')
export class MahasiswaAbsenMatkulController {
    constructor(
        private readonly mahasiswaAbsenMatkulService: MahasiswaAbsenMatkulService,
    ) {}

    @Get(':nim/:kode_matkul/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Query('nim') nim: string,
        @Query('kode_matkul') kode_matkul: string,
        @Query('semester') semester: number,
    ) {
        return this.mahasiswaAbsenMatkulService.findAll(
            nim,
            semester,
            kode_matkul,
        );
    }
}
