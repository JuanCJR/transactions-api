export class CreditScoreTooLowException extends Error {
  constructor(
    holderName: string,
    score: number,
    riskCategory: string,
    hasActiveDebts: boolean,
  ) {
    super(
      `El cliente ${holderName} no califica para abrir una cuenta. Score: ${score}, Riesgo: ${riskCategory}, Deudas Activas: ${hasActiveDebts ? 'SÍ' : 'NO'}.`,
    );
    this.name = 'CreditScoreTooLowException';
  }
}
