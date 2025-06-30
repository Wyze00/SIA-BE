import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { MatkulService } from './matkul.service';
import { CreateMatkulRequest } from './dto/create-matkul-request.dto';
import { UpdateMatkulRequest } from './dto/update-matkul.dto-request';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
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
        return await this.matkulService.create(request);
    }

    @Get()
    findAll() {
        return this.matkulService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.matkulService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateMatkulDto: UpdateMatkulRequest,
    ) {
        return this.matkulService.update(+id, updateMatkulDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.matkulService.remove(+id);
    }
}
