import { Module } from '@nestjs/common';
import { MatkulService } from './services/matkul.service';
import { MatkulController } from './controllers/matkul.controller';
import { MatkulRecomendationController } from './controllers/matkul-recomendation.controller.ts';
import { MatkulRecomendationService } from './services/matkul-recomendation.service';
import { DosenModule } from '../dosen/dosen.module';
import { MatkulRecomendationMahasiswaController } from './controllers/matkul-recomendation-mahasiswa.controller';
import { MatkulRecomendationMahasiswaService } from './services/matkul-recomendation-mahasiswa.service';

@Module({
    imports: [DosenModule],
    controllers: [
        MatkulRecomendationController,
        MatkulRecomendationMahasiswaController,
        MatkulController,
    ],
    providers: [
        MatkulService,
        MatkulRecomendationService,
        MatkulRecomendationMahasiswaService,
    ],
})
export class MatkulModule {}
