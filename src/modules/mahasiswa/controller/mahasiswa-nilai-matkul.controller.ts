import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MahasiswaNilaiMatkulService } from '../services/mahasiswa-nilai-matkul.service';
import { FindAllMahasiswaNilaiMatkulResponse } from '../dto/response/find-all-mahasiswa-nilai-matkul-response.dto';
import { FindAllMahasiswaNilaiMatkulRequest } from '../dto/request/find-all-mahasiswa-nilai-matkul-request.dto';
import { UpdateMahasiswaNilaiMatkulRequest } from '../dto/request/update-mahasiswa-nilai-matkul-request.dto';
import { UpdateMahasiswaNilaiMatkulRequestBody } from '../dto/request/mahasiswa-nilai-matkul-request.dto';
import { MahasiswaNilaiMatkulResponse } from '../dto/response/mahasiswa-nilai-matkul-response.dto';

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
        @Param() param: FindAllMahasiswaNilaiMatkulRequest,
    ): Promise<FindAllMahasiswaNilaiMatkulResponse> {
        return this.mahasiswaNilaiService.findAll(
            param.nim,
            param.semester,
            param.kode_matkul,
        );
    }

    @Put(':kode_matkul/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    update(
        @Param() param: UpdateMahasiswaNilaiMatkulRequest,
        @Body() request: UpdateMahasiswaNilaiMatkulRequestBody,
    ): Promise<MahasiswaNilaiMatkulResponse> {
        return this.mahasiswaNilaiService.update(param, request);
    }
}
