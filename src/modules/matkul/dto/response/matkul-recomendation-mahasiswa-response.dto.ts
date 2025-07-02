import { ApiProperty } from '@nestjs/swagger';
import { FindAllMatkulRecomendationResponse } from './find-all-recomendation-matkul-response.dto';
import { MatkulResponse } from './matkul-reesponse.dto';
import { MatkulRecomendation } from '../types/matkul-recomendation.type';

export class MatkulRecomendationMahasiswaResponse extends FindAllMatkulRecomendationResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    all: MatkulRecomendation;
}
