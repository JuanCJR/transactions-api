export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'CLP',
  ) {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
  }

  // Factoría estática para crear dinero de forma segura
  public static create(amount: number, currency: string = 'CLP'): Money {
    return new Money(amount, currency);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  // Los Value Objects son INMUTABLES. 
  // Cada operación matemática retorna una NUEVA instancia de Money.
  public add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.validateCurrency(other);
    if (this.amount < other.amount) {
      throw new Error('Monto insuficiente para realizar la resta');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  public isLessThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amount < other.amount;
  }

  private validateCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `No se pueden operar monedas distintas: ${this.currency} y ${other.currency}`,
      );
    }
  }
}
