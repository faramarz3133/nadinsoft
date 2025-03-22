import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const message = exception.getResponse();
  
        response.status(status).json({
          success: false,
          statusCode: status,
          message: message || 'An error occurred',
        });
      } else {
        console.error('Unexpected Error:', exception);
  
        response.status(500).json({
          success: false,
          statusCode: 500,
          message: 'Internal Server Error - Please contact support',
        });
      }
    }
  }
  