import { ApiProperty } from '@nestjs/swagger';
import { FindAllMatkulRecomendationResponse } from './find-all-recomendation-matkul-response.dto';
import { MatkulResponse } from './matkul-reesponse.dto';

export class MatkulRecomendationMahasiswaResponse extends FindAllMatkulRecomendationResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    allMatkul: MatkulResponse[];
}
