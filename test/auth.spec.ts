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
import { LoginUserResponse } from 'src/modules/auth/dto/login-user-response.dto';
import { ValidationError } from 'class-validator';
import { ErrorFilter } from 'src/common/filter/error.filter';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web-response.dto';

describe('Auth Controller', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
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

        await app.init();
    });

    describe('GET /auth/login', () => {
        it('should success', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    id: 'ADM9925001',
                    password: 'admin',
                });

            const body = response.body as WebResponse<LoginUserResponse>;
            expect(body.data?.id).toBe('ADM9925001');
            expect(body.data?.name).toBe('Admin 1');
            expect(body.data?.role).toBe('admin');
            expect(body.data?.token).toBeDefined();
        });

        it('should reject if field is empty', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    password: 'admin',
                });

            const body = response.body as WebResponse<null>;
            expect(body.errors).toBeDefined();
        });

        it('should reject if id.length > 10', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    id: 'ADM9925001999',
                    password: 'admin',
                });

            const body = response.body as WebResponse<null>;
            expect(body.errors).toBeDefined();
        });
    });
});
