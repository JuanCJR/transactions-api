export class CreditScoreTooLowException extends Error {
  constructor(holderName: string, score: number) {
    super(
      `El cliente ${holderName} no califica para abrir una cuenta debido a un score crediticio bajo (${score}).`,
    );
    this.name = 'CreditScoreTooLowException';
  }
}
