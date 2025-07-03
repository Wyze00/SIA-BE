import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { FindAllMatkulRecomendationRequest } from './find-all-recomendation-matkul-request.dto';

export class MatkulRecomendationRequest extends FindAllMatkulRecomendationRequest {
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
