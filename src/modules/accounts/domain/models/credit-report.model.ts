export class CreditReport {
  constructor(
    public readonly score: number,
    public readonly riskCategory: 'LOW' | 'MEDIUM' | 'HIGH',
    public readonly hasActiveDebts: boolean,
    public readonly lastChecked: Date,
  ) {}
}
