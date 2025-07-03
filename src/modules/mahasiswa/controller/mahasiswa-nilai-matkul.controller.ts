import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaNilaiMatkulService } from '../services/mahasiswa-nilai.service';
import { MahasiswaNilaiMatkulResponse } from '../dto/response/mahasiswa-nilai-matkul-response.dto';

@Controller('mahasiswa/nilai')
export class MahasiswaNilaiMatkulController {
    constructor(
        private readonly mahasiswaNilaiService: MahasiswaNilaiMatkulService,
    ) {}

    @Get(':nim/:kode_matkul/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Query('nim') nim: string,
        @Query('kode_matkul') kode_matkul: string,
        @Query('semester') semester: number,
    ): Promise<MahasiswaNilaiMatkulResponse[]> {
        return this.mahasiswaNilaiService.findAll(nim, semester, kode_matkul);
    }
}
