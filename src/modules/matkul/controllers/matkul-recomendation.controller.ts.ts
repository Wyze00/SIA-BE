import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Query,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { RecomendationMatkul } from '../dto/requet/recomendation-matkul.dto';
import { RecomendationMatkulResponse } from '../dto/response/recomendation-matkul-response.dto';
import { FindManyRecomendationMatkulRequest } from '../dto/requet/find-many-recomendation-matkul-request.dto';
import { MatkulRecomendationService } from '../services/matkul-recomendation.service';

@Controller('matkul/recomendation')
export class MatkulRecomendationController {
    constructor(
        private readonly matkulRecomendationService: MatkulRecomendationService,
    ) {}

    @ApiBody({
        type: RecomendationMatkul,
    })
    @ApiOkResponse({
        type: RecomendationMatkulResponse,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAllRecomendation(
        @Query() query: FindManyRecomendationMatkulRequest,
    ): Promise<RecomendationMatkulResponse> {
        return this.matkulRecomendationService.findAll(
            query.semester,
            query.jurusan,
        );
    }

    @ApiBody({
        type: RecomendationMatkul,
    })
    @ApiOkResponse({
        type: RecomendationMatkul,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    addRecomendation(
        @Body() request: RecomendationMatkul,
    ): Promise<RecomendationMatkul> {
        return this.matkulRecomendationService.add(request);
    }

    @ApiBody({
        type: RecomendationMatkul,
    })
    @ApiOkResponse({
        type: Boolean,
        example: true,
    })
    @ApiBearerAuth()
    @Delete()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    removeRecomendation(
        @Body() request: RecomendationMatkul,
    ): Promise<boolean> {
        return this.matkulRecomendationService.remove(request);
    }
}
