import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MatkulService } from './matkul.service';
import { CreateMatkulRequest } from './dto/create-matkul-request.dto';
import { UpdateMatkulRequest } from './dto/update-matkul.dto-request';

@Controller('matkul')
export class MatkulController {
    constructor(private readonly matkulService: MatkulService) {}

    @Post()
    create(@Body() createMatkulDto: CreateMatkulRequest) {
        return this.matkulService.create(createMatkulDto);
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
