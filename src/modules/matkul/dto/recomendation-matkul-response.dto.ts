import { ApiProperty } from '@nestjs/swagger';
import { MatkulResponse } from './matkul-reesponse.dto';

export class RecomendationMatkulResponse {
    @ApiProperty({
        type: [MatkulResponse],
    })
    in: MatkulResponse[];

    @ApiProperty({
        type: [MatkulResponse],
    })
    notIn: MatkulResponse[];
}
