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
import { MahasiswaSemesterService } from '../services/mahasiswa-semester.service';
import { FindAllMahaiswaSemesterResponse } from '../dto/find-all-mahasiswa-semester-response.dto';

@Controller('semester')
export class MahasiswaSemesterController {
    constructor(
        private readonly mahasiswaSemesterService: MahasiswaSemesterService,
    ) {}

    @Get(':nim/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findOne(
        @Param('nim') nim: string,
        @Param('semester') semester: number,
    ): Promise<FindAllMahaiswaSemesterResponse> {
        return this.mahasiswaSemesterService.findOne(nim, semester);
    }
}
