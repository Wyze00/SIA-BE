import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';
import { CreatMahasiswaRequest } from './dto/create-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { MahasiswaRespone } from './dto/mahasiswa-response.dto';
import { Mahasiswa } from '@prisma/client';

@Injectable()
export class MahasiswaService {
    constructor(private readonly prismaService: PrismaService) {}

    async createMahasiswa(
        request: CreatMahasiswaRequest,
    ): Promise<MahasiswaRespone> {
        const count: number = await this.prismaService.mahasiswa.count({
            where: {
                nim: request.id,
            },
        });

        if (count) {
            throw new HttpException(
                'Mahasiswa Sudah Ada',
                HttpStatus.BAD_REQUEST,
            );
        }

        const mhs: Mahasiswa = await this.prismaService.mahasiswa.create({
            data: {
                name: request.name,
                semester: request.semester,
                jurusan: request.jurusan,
                user: {
                    create: {
                        id: request.id,
                        name: request.name,
                        role: 'mahasiswa',
                        password: await bcrypt.hash(request.password, 10),
                    },
                },
            },
        });

        return mhs;
    }
}
