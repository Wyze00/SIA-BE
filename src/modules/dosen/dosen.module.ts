import { Module } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { DosenController } from './dosen.controller';
import { DosenRepository } from './dosen.repository';

@Module({
    providers: [DosenService, DosenRepository],
    controllers: [DosenController],
    exports: [DosenService],
})
export class DosenModule {}
