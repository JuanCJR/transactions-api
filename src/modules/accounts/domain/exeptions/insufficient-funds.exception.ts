export class InsufficientFundsException extends Error {
  constructor(accountId: string, required: number, available: number) {
    super(
      `La cuenta ${accountId} no tiene fondos suficientes. Requerido: ${required}, Disponible: ${available}`,
    );
    this.name = 'InsufficientFundsException';
  }
}
