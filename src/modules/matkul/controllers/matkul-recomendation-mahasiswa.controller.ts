import { Controller } from '@nestjs/common';
import { MatkulRecomendationMahasiswaService } from '../services/matkul-recomendation-mahasiswa.service';

@Controller('matkul/recomendation/mahasiswa')
export class MatkulRecomendationMahasiswaController {
    constructor(
        private readonly matkulRecomendationMahasiswaService: MatkulRecomendationMahasiswaService,
    ) {}
}
