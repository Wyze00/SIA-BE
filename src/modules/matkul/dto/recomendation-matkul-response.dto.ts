import { ApiProperty } from '@nestjs/swagger';
import { MatkulResponse } from './matkul-reesponse.dto';
import { MatkulRecomendation } from './matkul-recomendation.type';

export class RecomendationMatkulResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    in: MatkulRecomendation;

    @ApiProperty({
        type: [MatkulResponse],
    })
    notIn: MatkulRecomendation;
}
