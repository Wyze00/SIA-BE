import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Put,
} from '@nestjs/common';
import { MatkulService } from './matkul.service';
import { CreateMatkulRequest } from './dto/create-matkul-request.dto';
import { UpdateMatkulRequest } from './dto/update-matkul.dto-request';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { MatkulResponse } from './dto/matkul-reesponse.dto';

@Controller('matkul')
export class MatkulController {
    constructor(private readonly matkulService: MatkulService) {}

    @ApiBody({
        type: CreateMatkulRequest,
    })
    @ApiCreatedResponse({
        type: MatkulResponse,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async create(
        @Body() request: CreateMatkulRequest,
    ): Promise<MatkulResponse> {
        return this.matkulService.create(request);
    }

    @ApiOkResponse({
        type: [MatkulResponse],
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async findAll(): Promise<MatkulResponse[]> {
        return this.matkulService.findAll();
    }

    @ApiOkResponse({
        type: MatkulResponse,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    @Get(':kode_matkul')
    findOne(
        @Param('kode_matkul') kode_matkul: string,
    ): Promise<MatkulResponse> {
        return this.matkulService.findOne(kode_matkul);
    }

    @ApiOkResponse({
        type: MatkulResponse,
    })
    @ApiBearerAuth()
    @Put(':kode_matkul')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    update(
        @Param('kode_matkul') kode_matkul: string,
        @Body() request: UpdateMatkulRequest,
    ): Promise<MatkulResponse> {
        return this.matkulService.update(kode_matkul, request);
    }

    @Delete(':kode_matkul')
    remove(@Param('kode_matkul') kode_matkul: string) {
        return this.matkulService.remove(+kode_matkul);
    }
}
