import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from '@nestjs/common';
import { MahasiswaAbsenMatkulService } from '../services/mahasiswa-absen-matkul.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('mahasiswa/:nim/absen')
export class MahasiswaAbsenMatkulController {
    constructor(
        private readonly mahasiswaAbsenMatkulService: MahasiswaAbsenMatkulService,
    ) {}

    @Get(':kode_matkul/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Param('nim') nim: string,
        @Param('kode_matkul') kode_matkul: string,
        @Param('semester') semester: number,
    ) {
        return this.mahasiswaAbsenMatkulService.findAll(
            nim,
            semester,
            kode_matkul,
        );
    }
}
