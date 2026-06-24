import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../domain/ports/app-config.port';

@Injectable()
export class NestConfigAdapter implements AppConfig {
  public getTransferLimit(): number {
    const limit = process.env.TRANSFER_LIMIT;
    return limit ? parseInt(limit, 10) : 100000; // 100,000 CLP por defecto
  }
}
