import { ApiProperty } from '@nestjs/swagger';
import { MatkulResponse } from './matkul-reesponse.dto';
import { MatkulRecomendation } from '../types/matkul-recomendation.type';

export class FindAllMatkulRecomendationResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    in: MatkulRecomendation;

    @ApiProperty({
        type: [MatkulResponse],
    })
    notIn: MatkulRecomendation;
}
