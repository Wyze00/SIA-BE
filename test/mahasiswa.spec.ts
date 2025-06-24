import { Test, TestingModule } from '@nestjs/testing';
import {
    HttpException,
    HttpStatus,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ValidationError } from 'class-validator';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web-response.dto';
import { TestService } from './util/test.service';
import { MahasiswaRespone } from 'src/modules/mahasiswa/dto/mahasiswa-response.dto';
import { TestModule } from './util/test.module';

describe('Auth Controller', () => {
    let app: INestApplication<App>;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: (e: ValidationError[]) => {
                    return new HttpException(
                        e
                            .map((err: ValidationError) => {
                                if (err.constraints) {
                                    return Object.values(err.constraints).join(
                                        ', ',
                                    );
                                }
                                return `Invalid field: ${err.property}`;
                            })
                            .join(', '),
                        HttpStatus.BAD_REQUEST,
                    );
                },
            }),
        );

        const loggerInstance: Logger = app.get(WINSTON_MODULE_PROVIDER);

        app.useGlobalFilters(new ErrorFilter(loggerInstance));

        app.useGlobalInterceptors(new ResponseInterceptor(loggerInstance));

        testService = app.get(TestService);
        await app.init();
    });

    describe('POST /mahasiswa', () => {
        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .post('/mahasiswa')
                .set('Authorization', testService.ADMIN_TOKEN)
                .send({
                    id: 'IF1125001',
                    password: 'test',
                    name: 'Tester',
                    jurusan: 'informatika',
                    semester: 1,
                    angkatan: '2025',
                });

            const body = response.body as WebResponse<MahasiswaRespone>;
            expect(body.data?.nim).toBe('IF1125001');
            expect(body.data?.name).toBe('Tester');
            expect(body.data?.jurusan).toBe('informatika');
            expect(body.data?.semester).toBe(1);
            expect(body.data?.angkatan).toBe('2025');

            console.log(body);
        });
    });

    describe('PUT /mahasiswa/:id', () => {
        beforeEach(async () => {
            await testService.createMahasiswa();
        });

        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .put('/mahasiswa/IF1125001')
                .set('Authorization', testService.ADMIN_TOKEN)
                .send({
                    nim: 'IF1125001',
                    name: 'update',
                    jurusan: 'dkv',
                    semester: 3,
                    angkatan: '2024',
                });

            const body = response.body as WebResponse<MahasiswaRespone>;
            expect(body.data?.nim).toBe('IF1125001');
            expect(body.data?.name).toBe('update');
            expect(body.data?.jurusan).toBe('dkv');
            expect(body.data?.semester).toBe(3);
            expect(body.data?.angkatan).toBe('2024');

            console.log(body);
        });
    });

    describe('GET /mahasiswa', () => {
        beforeEach(async () => {
            await testService.createMahasiswa();
        });

        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/mahasiswa')
                .set('Authorization', testService.MHS_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone>;
            expect(body.data?.nim).toBe('IF1125001');
            expect(body.data?.name).toBe('Tester');
            expect(body.data?.jurusan).toBe('informatika');
            expect(body.data?.semester).toBe(1);
            expect(body.data?.angkatan).toBe('2025');

            console.log(body);
        });
    });

    describe('GET /mahasiswa/:id', () => {
        beforeEach(async () => {
            await testService.createMahasiswa();
        });

        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/mahasiswa/IF1125001')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone>;
            expect(body.data?.nim).toBe('IF1125001');
            expect(body.data?.name).toBe('Tester');
            expect(body.data?.jurusan).toBe('informatika');
            expect(body.data?.semester).toBe(1);
            expect(body.data?.angkatan).toBe('2025');

            console.log(body);
        });
    });

    describe('GET /mahasiswa/admin', () => {
        beforeEach(async () => {
            await testService.createMahasiswa();
        });

        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/mahasiswa/admin')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone[]>;
            expect(body.data).toHaveLength(1);

            console.log(body);
        });

        it('should success with query', async () => {
            const response = await request(app.getHttpServer())
                .get('/mahasiswa/admin?semester=3')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone[]>;
            expect(body.data).toHaveLength(0);

            console.log(body);
        });

        it('should success with query', async () => {
            const response = await request(app.getHttpServer())
                .get('/mahasiswa/admin?jurusan=dkv')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone[]>;
            expect(body.data).toHaveLength(0);

            console.log(body);
        });

        it('should success with query', async () => {
            const response = await request(app.getHttpServer())
                .get(
                    '/mahasiswa/admin?jurusan=informatika&semester=1&angkatan=2025',
                )
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<MahasiswaRespone[]>;
            expect(body.data).toHaveLength(1);

            console.log(body);
        });
    });

    describe('DELETE /mahasiswa/:id', () => {
        beforeEach(async () => {
            await testService.createMahasiswa();
        });

        afterEach(async () => {
            await testService.deleteMahasiswa();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .delete('/mahasiswa/IF1125001')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<boolean>;
            expect(body.data).toBe(true);

            console.log(body);
        });
    });
});
