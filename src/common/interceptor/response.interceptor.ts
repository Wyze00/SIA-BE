import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { WebResponse } from '../dto/web-response.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<WebResponse<T>> {
        const request: Request = context.switchToHttp().getRequest();

        this.logger.info(`[Request From] : ${request.path}`);

        return next.handle().pipe(
            tap((val: any) => {
                this.logger.info(`[Response From] ${request.path} : ${val}`);
            }),
            map((val: T) => ({
                data: val,
            })),
        );
    }
}
