import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/provider/prisma.service';

@Injectable()
export class TestService {
    constructor(private readonly prismaService: PrismaService) {}

    readonly ADMIN_TOKEN =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFETTk5MjUwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTA2NjMzMDcsImV4cCI6MTc4MjE5OTMwN30.fneQPA3MrRzFgDkW9Ebi_JGY0zwWdJ8CqgQRCb5fBKc';

    readonly MHS_TOKEN =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IklGMTEyNTAwMSIsInJvbGUiOiJtYWhhc2lzd2EiLCJpYXQiOjE3NTA2Njc1NjgsImV4cCI6MTc4MjIwMzU2OH0.Jw8lXTnU0QQVojIKOBgdTe350NJWV4q2waMd3YN2dO4';

    async deleteMahasiswa() {
        await this.prismaService.mahasiswa.deleteMany({
            where: {
                nim: 'IF1125001',
            },
        });

        await this.prismaService.user.deleteMany({
            where: {
                id: 'IF1125001',
            },
        });
    }

    async createMahasiswa() {
        await this.prismaService.user.create({
            data: {
                id: 'IF1125001',
                name: 'Tester',
                password: 'test',
                role: 'mahasiswa',
                mahasiswa: {
                    create: {
                        jurusan: 'informatika',
                        name: 'Tester',
                        semester: 1,
                    },
                },
            },
        });
    }
}
