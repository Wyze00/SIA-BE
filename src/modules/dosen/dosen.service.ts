import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreateDosenRequest } from './dto/create-dosen-request.dto';
import { DosenResponse } from './dto/dosen-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DosenService {
    constructor(private readonly prismaService: PrismaService) {}

    async createDosen(request: CreateDosenRequest): Promise<DosenResponse> {
        const count: number = await this.prismaService.dosen.count({
            where: {
                nip: request.id,
            },
        });

        if (count) {
            throw new HttpException('Dosen Sudah Ada', HttpStatus.BAD_REQUEST);
        }

        const dosen = await this.prismaService.user.create({
            data: {
                id: request.id,
                name: request.name,
                role: 'dosen',
                password: await bcrypt.hash(request.password, 10),
                dosen: {
                    create: {
                        name: request.name,
                    },
                },
            },
            include: {
                dosen: true,
            },
        });

        return dosen.dosen!;
    }
}
