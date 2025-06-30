import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { FindManyRecomendationMatkulRequest } from './find-many-recomendation-matkul-request.dto';

export class RecomendationMatkulRequest extends FindManyRecomendationMatkulRequest {
    @ApiProperty({
        type: String,
        example: 'IF-101',
        minLength: 1,
        maxLength: 10,
    })
    @IsString()
    @Length(1, 10)
    kode_matkul: string;
}
