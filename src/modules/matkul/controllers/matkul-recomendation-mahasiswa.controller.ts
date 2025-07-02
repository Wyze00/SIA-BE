import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MatkulRecomendationMahasiswaService } from '../services/matkul-recomendation-mahasiswa.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { MatkulRecomendationMahasiswaResponse } from '../dto/response/matkul-recomendation-mahasiswa-response.dto';

@Controller('matkul/recomendation/mahasiswa')
export class MatkulRecomendationMahasiswaController {
    constructor(
        private readonly matkulRecomendationMahasiswaService: MatkulRecomendationMahasiswaService,
    ) {}

    @ApiBody({})
    @ApiOkResponse({})
    @ApiBearerAuth()
    @Get(':nim')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Query('nim') nim: string,
        @Param('semster', ParseIntPipe) semester: number,
    ): Promise<MatkulRecomendationMahasiswaResponse> {
        return this.matkulRecomendationMahasiswaService.findAll(nim, semester);
    }

    // @ApiBody({
    //     type: MatkulRecomendationRequest,
    // })
    // @ApiOkResponse({
    //     type: MatkulRecomendationResponse,
    // })
    // @ApiBearerAuth()
    // @Post()
    // @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    // @UseGuards(JwtGuard)
    // add(
    //     @Body() request: MatkulRecomendationRequest,
    // ): Promise<MatkulRecomendationResponse> {
    //     return this.matkulRecomendationService.add(request);
    // }

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
