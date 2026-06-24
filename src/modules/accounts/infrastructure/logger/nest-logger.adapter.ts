import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from '../../domain/ports/logger.port';

@Injectable()
export class NestLoggerAdapter implements LoggerPort {
  private readonly logger = new Logger('HexagonalCore');

  public log(message: string): void {
    this.logger.log(message);
  }

  public error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
}
