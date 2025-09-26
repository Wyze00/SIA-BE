import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException, Error)
export class ErrorFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    catch(exception: Error, host: ArgumentsHost) {
        const response: Response = host.switchToHttp().getResponse<Response>();
        const request: Request = host.switchToHttp().getRequest<Request>();
        this.logger.info(
            `[Request Error From] ${request.path} : ${exception.message}`,
        );

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                errors: exception.getResponse(),
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                errors: exception.message,
            });
        }
    }
}
