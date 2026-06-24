import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { InsufficientFundsException } from '../../domain/exceptions/insufficient-funds.exception';
import { CreditScoreTooLowException } from '../../domain/exceptions/credit-score-too-low.exception';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Si es una excepción de HTTP nativa de NestJS (ej: BadRequestException de validaciones),
    // la dejamos pasar con su formato y estado HTTP nativo.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      return response.status(status).json(exceptionResponse);
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Ocurrió un error inesperado en el servidor.';

    // 2. Mapeamos la excepción de negocio: Fondos Insuficientes
    if (exception instanceof InsufficientFundsException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY; // 422
      errorCode = 'INSUFFICIENT_FUNDS';
      message = exception.message;
    } 
    // 3. Mapeamos la excepción de negocio: Score Crediticio Bajo
    else if (exception instanceof CreditScoreTooLowException) {
      status = HttpStatus.BAD_REQUEST; // 400
      errorCode = 'CREDIT_SCORE_TOO_LOW';
      message = exception.message;
    }
    // 4. Mapeamos errores genéricos lanzados por reglas de validación de la aplicación/casos de uso
    else if (exception instanceof Error && this.isBusinessError(exception)) {
      status = HttpStatus.BAD_REQUEST; // 400
      errorCode = 'BUSINESS_RULE_VIOLATION';
      message = exception.message;
    }

    return response.status(status).json({
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private isBusinessError(error: Error): boolean {
    return (
      error.message.includes('límite máximo') ||
      error.message.includes('no existe') ||
      error.name === 'InsufficientFundsException' ||
      error.name === 'CreditScoreTooLowException'
    );
  }
}
