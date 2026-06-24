import { Injectable } from '@nestjs/common';
import { CreditBureauPort } from '../../domain/ports/credit-bureau.port';

@Injectable()
export class MockCreditBureauAdapter implements CreditBureauPort {
  public async getCreditScore(holderName: string): Promise<number> {
    const nameLower = holderName.toLowerCase();
    
    if (nameLower.includes('deudor') || nameLower.includes('moroso')) {
      return 350; // Rechazado
    }
    
    return 750; // Aprobado
  }
}
