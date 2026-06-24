import { Injectable } from '@nestjs/common';
import { CreditBureauPort } from '../../domain/ports/credit-bureau.port';
import { CreditReport } from '../../domain/models/credit-report.model';

interface EquifaxRawResponse {
  cod_score: number;
  eval_risk_desc: string; // 'bajo', 'medio', 'alto'
  deuda_monto_total: number;
  fecha_consulta: string;
}

@Injectable()
export class MockCreditBureauAdapter implements CreditBureauPort {
  public async getCreditReport(holderName: string): Promise<CreditReport> {
    const nameLower = holderName.toLowerCase();
    
    let rawData: EquifaxRawResponse = {
      cod_score: 750,
      eval_risk_desc: 'bajo',
      deuda_monto_total: 0,
      fecha_consulta: new Date().toISOString(),
    };

    if (nameLower.includes('moroso')) {
      rawData = {
        cod_score: 550,
        eval_risk_desc: 'medio',
        deuda_monto_total: 2500000,
        fecha_consulta: new Date().toISOString(),
      };
    } else if (nameLower.includes('deudor')) {
      rawData = {
        cod_score: 350,
        eval_risk_desc: 'alto',
        deuda_monto_total: 0,
        fecha_consulta: new Date().toISOString(),
      };
    }

    return new CreditReport(
      rawData.cod_score,
      this.mapRiskCategory(rawData.eval_risk_desc),
      rawData.deuda_monto_total > 0,
      new Date(rawData.fecha_consulta)
    );
  }

  private mapRiskCategory(desc: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (desc === 'alto') return 'HIGH';
    if (desc === 'medio') return 'MEDIUM';
    return 'LOW';
  }
}
