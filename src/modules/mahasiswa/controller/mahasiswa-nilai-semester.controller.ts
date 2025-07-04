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
import { MahasiswaNilaiSemesterService } from '../services/mahasiswa-nilai-semester.service';
import { MahasiswaNilaiSemesterResponse } from '../dto/response/mahasiswa-nilai-semester-response';

@Controller('mahasiswa/:nim/semester')
export class MahasiswaNilaiSemesterController {
    constructor(
        private readonly mahasiswaSemesterService: MahasiswaNilaiSemesterService,
    ) {}

    @Get(':semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findOne(
        @Param('nim') nim: string,
        @Param('semester') semester: number,
    ): Promise<MahasiswaNilaiSemesterResponse> {
        return this.mahasiswaSemesterService.findOne(nim, semester);
    }
}
