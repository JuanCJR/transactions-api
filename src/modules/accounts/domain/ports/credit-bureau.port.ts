import { CreditReport } from '../models/credit-report.model';

export abstract class CreditBureauPort {
  abstract getCreditReport(holderName: string): Promise<CreditReport>;
}
