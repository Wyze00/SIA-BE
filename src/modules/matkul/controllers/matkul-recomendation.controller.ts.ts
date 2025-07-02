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
import { MatkulRecomendationRequest } from '../dto/requet/recomendation-matkul.dto';
import { FindAllMatkulRecomendationResponse } from '../dto/response/find-all-recomendation-matkul-response.dto';
import { FindAllMatkulRecomendationRequest } from '../dto/requet/find-all-recomendation-matkul-request.dto';
import { MatkulRecomendationService } from '../services/matkul-recomendation.service';
import { MatkulRecomendationResponse } from '../dto/response/recomendation-matkul-response.dto';

@Controller('matkul/recomendation')
export class MatkulRecomendationController {
    constructor(
        private readonly matkulRecomendationService: MatkulRecomendationService,
    ) {}

    @ApiBody({
        type: FindAllMatkulRecomendationRequest,
    })
    @ApiOkResponse({
        type: FindAllMatkulRecomendationResponse,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    findAll(
        @Query() query: FindAllMatkulRecomendationRequest,
    ): Promise<FindAllMatkulRecomendationResponse> {
        return this.matkulRecomendationService.findAll(
            query.semester,
            query.jurusan,
        );
    }

    @ApiBody({
        type: MatkulRecomendationRequest,
    })
    @ApiOkResponse({
        type: MatkulRecomendationResponse,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    add(
        @Body() request: MatkulRecomendationRequest,
    ): Promise<MatkulRecomendationResponse> {
        return this.matkulRecomendationService.add(request);
    }

    @ApiBody({
        type: MatkulRecomendationRequest,
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
    remove(@Body() request: MatkulRecomendationRequest): Promise<boolean> {
        return this.matkulRecomendationService.remove(request);
    }
}
