import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
    WINSTON_MODULE_NEST_PROVIDER,
    WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrorFilter } from './common/filter/error.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors();

    // Enable helmet
    app.use(helmet());

    // Enable shutdown hook
    app.enableShutdownHooks();

    // Enable Validator
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

    // Use Logger
    const logger: Logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    const loggerInstance: Logger = app.get(WINSTON_MODULE_PROVIDER);
    app.useLogger(logger);

    // Use Filter
    app.useGlobalFilters(new ErrorFilter(loggerInstance));

    // Use Interceptor
    app.useGlobalInterceptors(new ResponseInterceptor(loggerInstance));

    // Configuration
    const configService: ConfigService = app.get(ConfigService);
    const PORT = configService.get<number>('PORT') || 3000;
    const HOST = configService.get<string>('HOST') || 'localhost';

    // OpenApi Swagger
    const docsConfig = new DocumentBuilder()
        .setTitle('SIA ITHB')
        .setDescription('Api DOCS untuk SIA_ITHB')
        .addBearerAuth()
        .build();

    const docs = SwaggerModule.createDocument(app, docsConfig);
    SwaggerModule.setup('api', app, docs);

    // Liten
    await app.listen(PORT, () => {
        loggerInstance.info(`Application start at : http://${HOST}:${PORT}`);
    });
}
bootstrap();
