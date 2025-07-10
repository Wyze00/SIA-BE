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
import { RequestUser } from '../dto/request-user.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<WebResponse<T>> {
        const request: RequestUser = context.switchToHttp().getRequest();

        this.logger.debug(
            `[Request From ${request.user.id}] : ${request.path} | Controller ${context.getClass().name} | Handler ${context.getHandler().name} ${request.body ? 'Body :' + JSON.stringify(request.body) : ''}`,
        );

        this.logger.info(
            `[${request.method} ${request.path}] [${request.user.id} ${request.user.role}]`,
        );

        return next.handle().pipe(
            tap((val: any) => {
                this.logger.debug(
                    `[Response From] ${request.path} : ${JSON.stringify(val)}`,
                );
            }),
            map((val: T) => ({
                data: val,
            })),
        );
    }
}
