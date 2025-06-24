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
import { TestModule } from './util/test.module';
import { DosenResponse } from 'src/modules/dosen/dto/dosen-response.dto';

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

    describe('POST /dosen', () => {
        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .post('/dosen')
                .set('Authorization', testService.ADMIN_TOKEN)
                .send({
                    id: 'DSN5525001',
                    password: 'test',
                    name: 'Tester Dosen',
                });

            const body = response.body as WebResponse<DosenResponse>;
            expect(body.data?.nip).toBe('DSN5525001');
            expect(body.data?.name).toBe('Tester Dosen');

            console.log(body);
        });
    });

    describe('PUT /dosen/:id', () => {
        beforeEach(async () => {
            await testService.createDosen();
        });

        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .put('/dosen/DSN5525001')
                .set('Authorization', testService.ADMIN_TOKEN)
                .send({
                    nip: 'DSN5525001',
                    name: 'update',
                });

            const body = response.body as WebResponse<DosenResponse>;
            expect(body.data?.nip).toBe('DSN5525001');
            expect(body.data?.name).toBe('update');

            console.log(body);
        });
    });

    describe('GET /dosen', () => {
        beforeEach(async () => {
            await testService.createDosen();
        });

        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/dosen')
                .set('Authorization', testService.DOSEN_TOKEN);

            const body = response.body as WebResponse<DosenResponse>;
            expect(body.data?.nip).toBe('DSN5525001');
            expect(body.data?.name).toBe('Tester Dosen');

            console.log(body);
        });
    });

    describe('GET /dosen/:nip', () => {
        beforeEach(async () => {
            await testService.createDosen();
        });

        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/dosen/DSN5525001')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<DosenResponse>;
            expect(body.data?.nip).toBe('DSN5525001');
            expect(body.data?.name).toBe('Tester Dosen');

            console.log(body);
        });
    });

    describe('GET /dosen/admin', () => {
        beforeEach(async () => {
            await testService.createDosen();
        });

        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .get('/dosen/admin')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<DosenResponse[]>;
            expect(body.data).toHaveLength(1);

            console.log(body);
        });
    });

    describe('DELETE /dosen/:id', () => {
        beforeEach(async () => {
            await testService.createDosen();
        });

        afterEach(async () => {
            await testService.deleteDosen();
        });
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .delete('/dosen/DSN5525001')
                .set('Authorization', testService.ADMIN_TOKEN);

            const body = response.body as WebResponse<boolean>;
            expect(body.data).toBe(true);

            console.log(body);
        });
    });
});
