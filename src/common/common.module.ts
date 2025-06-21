import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './provider/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
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
