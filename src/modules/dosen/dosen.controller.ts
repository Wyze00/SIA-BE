import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { DosenService } from './dosen.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { DosenResponse } from './dto/dosen-response.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { UpdateDosenRequest } from './dto/update-dosen-request.dto';

@Controller('dosen')
export class DosenController {
    constructor(private readonly dosenService: DosenService) {}

    @ApiBody({
        type: CreateDosenRequest,
    })
    @ApiCreatedResponse({
        type: DosenResponse,
    })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async createDosen(
        @Body() request: CreateDosenRequest,
    ): Promise<DosenResponse> {
        return await this.dosenService.createDosen(request);
    }

    @ApiBody({
        type: UpdateDosenRequest,
    })
    @ApiOkResponse({
        type: DosenResponse,
    })
    @ApiBearerAuth()
    @Put('/:nip')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async updateDosen(
        @Param('nip') nip: string,
        @Body() request: UpdateDosenRequest,
    ): Promise<DosenResponse> {
        return await this.dosenService.updateDosen(nip, request);
    }

    // @ApiOkResponse({
    //     type: DosenResponse,
    // })
    // @ApiBearerAuth()
    // @Get()
    // @HttpCode(HttpStatus.OK)
    // @Roles('mahasiswa')
    // @UseGuards(JwtGuard)
    // async findMahasiswa(@User() user: UserRole): Promise<DosenResponse> {
    //     throw new Error('Not implemented');
    // }

    // @ApiOkResponse({
    //     type: [DosenResponse],
    // })
    // @ApiBearerAuth()
    // @Get('/admin')
    // @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    // @UseGuards(JwtGuard)
    // async findManyMahasiswa(): Promise<DosenResponse[]> {
    //     throw new Error('Not implemented');
    // }

    // @ApiOkResponse({
    //     type: DosenResponse,
    // })
    // @ApiBearerAuth()
    // @Get('/:nim')
    // @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    // @UseGuards(JwtGuard)
    // async findMahasiswaByNim(
    //     @Param('nim') nim: string,
    // ): Promise<DosenResponse> {
    //     throw new Error('Not implemented');
    // }

    // @ApiOkResponse({
    //     type: Boolean,
    //     example: true,
    // })
    // @ApiBearerAuth()
    // @Delete('/:nim')
    // @HttpCode(HttpStatus.OK)
    // @Roles('admin')
    // @UseGuards(JwtGuard)
    // async deleteMahasiswa(@Param('nim') nim: string): Promise<boolean> {
    //     throw new Error('Not implemented');
    // }
}
