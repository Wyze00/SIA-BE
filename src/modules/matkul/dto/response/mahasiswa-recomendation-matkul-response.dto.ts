import { ApiProperty } from '@nestjs/swagger';
import { RecomendationMatkulResponse } from './recomendation-matkul-response.dto';
import { MatkulResponse } from './matkul-reesponse.dto';

export class MahasiswaRecomendationMatkulResponse extends RecomendationMatkulResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    all: MatkulResponse[];
}
