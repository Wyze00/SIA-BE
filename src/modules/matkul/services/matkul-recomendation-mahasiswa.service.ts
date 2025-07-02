import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';

@Injectable()
export class MatkulRecomendationMahasiswaService {
    constructor(private readonly prismaService: PrismaService) {}
}
