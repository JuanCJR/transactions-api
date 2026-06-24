import { InsufficientFundsException } from '../exeptions/insufficient-funds.exception';
import { Money } from './money.vo';

export class Account {
  constructor(
    private readonly id: string,
    private readonly holderName: string,
    private balance: Money,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getHolderName(): string {
    return this.holderName;
  }

  public getBalance(): Money {
    return this.balance;
  }

  // REGLAS DE NEGOCIO (Comportamiento y encapsulamiento)

  /**
   * Deposita un monto en la cuenta.
   */
  public deposit(amount: Money): void {
    this.balance = this.balance.add(amount);
  }

  /**
   * Retira un monto de la cuenta. Valida fondos.
   */
  public withdraw(amount: Money): void {
    if (this.balance.isLessThan(amount)) {
      throw new InsufficientFundsException(
        this.id,
        amount.getAmount(),
        this.balance.getAmount(),
      );
    }
    this.balance = this.balance.subtract(amount);
  }
}
