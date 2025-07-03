import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { MatkulRecomendationMahasiswaService } from '../services/matkul-recomendation-mahasiswa.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';
import { MatkulRecomendationMahasiswaRequest } from '../dto/request/matkul-recomendation-mahasiswa-request.dto';
import { UpdateMatkulRecomendationMahasiswaRequest } from '../dto/request/update-matkul-recomendation-mahasiswa-request.dto';

@Controller('matkul/recomendation/mahasiswa')
export class MatkulRecomendationMahasiswaController {
    constructor(
        private readonly matkulRecomendationMahasiswaService: MatkulRecomendationMahasiswaService,
    ) {}

    @ApiBody({})
    @ApiOkResponse({})
    @ApiBearerAuth()
    @Get(':nim/:semester')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Param() param: MatkulRecomendationMahasiswaRequest,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        return this.matkulRecomendationMahasiswaService.findAll(
            param.nim,
            param.semester,
        );
    }

    @ApiBody({
        type: UpdateMatkulRecomendationMahasiswaRequest,
    })
    @ApiBearerAuth()
    @Post(':nim/:semester/:kode_matkul')
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    create(@Param() param: UpdateMatkulRecomendationMahasiswaRequest) {
        return this.matkulRecomendationMahasiswaService.create(
            param.nim,
            param.semester,
            param.kode_matkul,
        );
    }

    // @ApiBody({
    //     type: MatkulRecomendationRequest,
    // })
    // @ApiOkResponse({
    //     type: Boolean,
    //     example: true,
    // })
    // @ApiBearerAuth()
    // @Delete()
    // @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    // @UseGuards(JwtGuard)
    // remove(@Body() request: MatkulRecomendationRequest): Promise<boolean> {
    //     return this.matkulRecomendationService.remove(request);
    // }
}
