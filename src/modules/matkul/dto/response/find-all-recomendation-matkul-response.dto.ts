import { ApiProperty } from '@nestjs/swagger';
import { MatkulResponse } from './matkul-reesponse.dto';

export class FindAllMatkulRecomendationResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    selected: MatkulResponse[];

    @ApiProperty({
        type: [MatkulResponse],
    })
    recomended: MatkulResponse[];
}
