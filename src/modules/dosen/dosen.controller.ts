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
import { User } from 'src/common/decorator/user.decorator';
import { UserRole } from 'src/common/dto/user-role.dto';

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
    async create(@Body() request: CreateDosenRequest): Promise<DosenResponse> {
        return await this.dosenService.create(request);
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
    async update(
        @Param('nip') nip: string,
        @Body() request: UpdateDosenRequest,
    ): Promise<DosenResponse> {
        return await this.dosenService.update(nip, request);
    }

    @ApiOkResponse({
        type: DosenResponse,
    })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles('dosen')
    @UseGuards(JwtGuard)
    async findOne(@User() user: UserRole): Promise<DosenResponse> {
        return await this.dosenService.findOne(user.id);
    }

    @ApiOkResponse({
        type: [DosenResponse],
    })
    @ApiBearerAuth()
    @Get('/admin')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async findAll(): Promise<DosenResponse[]> {
        return await this.dosenService.findAll();
    }

    @ApiOkResponse({
        type: DosenResponse,
    })
    @ApiBearerAuth()
    @Get('/:nip')
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async findOneWithNip(@Param('nip') nip: string): Promise<DosenResponse> {
        return await this.dosenService.findOne(nip);
    }

    @ApiBearerAuth()
    @Delete('/:nip')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles('admin')
    @UseGuards(JwtGuard)
    async remove(@Param('nip') nip: string): Promise<void> {
        return await this.dosenService.remove(nip);
    }
}
