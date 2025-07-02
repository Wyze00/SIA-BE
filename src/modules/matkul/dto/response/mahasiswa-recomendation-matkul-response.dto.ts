import { ApiProperty } from '@nestjs/swagger';
import { FindAllMatkulRecomendationResponse } from './find-all-recomendation-matkul-response.dto';
import { MatkulResponse } from './matkul-reesponse.dto';

export class MatkulMahasiswaRecomendationResponse extends FindAllMatkulRecomendationResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    all: MatkulResponse[];
}
