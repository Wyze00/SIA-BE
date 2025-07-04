import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaNilaiMatkulService } from '../services/mahasiswa-nilai.service';
import { FindAllMahasiswaNilaiMatkulResponse } from '../dto/response/find-all-mahasiswa-nilai-matkul-response.dto';

@Controller('mahasiswa/:nim/nilai')
export class MahasiswaNilaiMatkulController {
    constructor(
        private readonly mahasiswaNilaiService: MahasiswaNilaiMatkulService,
    ) {}

    @Get(':kode_matkul/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Param('nim') nim: string,
        @Param('kode_matkul') kode_matkul: string,
        @Param('semester') semester: number,
    ): Promise<FindAllMahasiswaNilaiMatkulResponse> {
        return this.mahasiswaNilaiService.findAll(nim, semester, kode_matkul);
    }
}
