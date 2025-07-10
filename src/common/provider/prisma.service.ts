import {
    Inject,
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
    extends PrismaClient<Prisma.PrismaClientOptions, string>
    implements OnModuleInit, OnApplicationShutdown
{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        super({
            log: [
                {
                    level: 'error',
                    emit: 'event',
                },
                {
                    level: 'info',
                    emit: 'event',
                },
                {
                    level: 'query',
                    emit: 'event',
                },
                {
                    level: 'warn',
                    emit: 'event',
                },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();

        this.$on('error', (msg: Prisma.LogEvent) => {
            this.logger.error(msg);
        });

        this.$on('info', (msg: Prisma.LogEvent) => {
            this.logger.debug(msg);
        });

        this.$on('query', (msg: Prisma.QueryEvent) => {
            this.logger.debug(msg);
        });

        this.$on('warn', (msg: Prisma.LogEvent) => {
            this.logger.warn(msg);
        });
    }

    async onApplicationShutdown(signal: string) {
        this.logger.debug(`Shutdown App with signal : ${signal}`);
        await this.$disconnect();
    }
}
