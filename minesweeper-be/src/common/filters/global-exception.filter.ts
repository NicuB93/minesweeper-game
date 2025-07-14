/* This is a NestJS exception filter for handling GraphQL and HTTP exceptions, logging error messages,
and returning appropriate responses. */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

type DefaultRespObj = {
  statusCode: number;
  timestamp: string;
  url: string;
  error: string;
  message: string | object;
};

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger = new Logger(GlobalExceptionFilter.name),
  ) {}
  catch(exception, host: ArgumentsHost) {
    this.httpException(exception, host);
  }

  private httpException(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorRespObj: DefaultRespObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      url: request.url,
      error: ('name' in exception && typeof exception.name === 'string'
        ? exception.name
        : 'UnknownError') as string,
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      errorRespObj.statusCode = exception.getStatus();
      errorRespObj.message = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      errorRespObj.statusCode = 422; //default to Unprocessable Entity
      errorRespObj.message = exception.message.replaceAll(/\n/g, ' ');
    } else {
      errorRespObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorRespObj.message = 'Internal Server Error';
    }

    this.logger.error(exception.name, exception.message, exception.stack);

    response.status(errorRespObj.statusCode).send(errorRespObj);
  }
}

export default GlobalExceptionFilter;
