import { Module } from '@nestjs/common';
import { MatkulService } from './matkul.service';
import { MatkulController } from './matkul.controller';

@Module({
    controllers: [MatkulController],
    providers: [MatkulService],
})
export class MatkulModule {}
