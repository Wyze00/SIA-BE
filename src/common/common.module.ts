import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './provider/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    level: 'info',
                    filename: path.join(
                        __dirname,
                        '..',
                        '..',
                        'logs',
                        'logs.log',
                    ),
                    maxsize: 5 * 1024 * 1024,
                    maxFiles: 5,
                    // [timesampt] [method + endpoint] [id]
                    format: winston.format.printf(
                        (info: winston.Logform.TransformableInfo) =>
                            `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [${info.level}] ${info.message as string}`,
                    ),
                }),
            ],
            level: 'debug',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const pass =
                    configService.get<string>('JWT_SECRET') || 'RAHASIA';

                return {
                    global: true,
                    secret: pass,
                    signOptions: {
                        expiresIn: '365d',
                    },
                };
            },
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 100,
                },
            ],
        }),
    ],
    providers: [PrismaService],
    exports: [PrismaService, JwtModule],
})
export class CommonModule {}
