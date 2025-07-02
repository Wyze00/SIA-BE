import { Module } from '@nestjs/common';
import { MatkulService } from './services/matkul.service';
import { MatkulController } from './controllers/matkul.controller';
import { MatkulRecomendationController } from './controllers/matkul-recomendation.controller.ts';
import { MatkulRecomendationService } from './services/matkul-recomendation.service';

@Module({
    controllers: [MatkulRecomendationController, MatkulController],
    providers: [MatkulService, MatkulRecomendationService],
})
export class MatkulModule {}
