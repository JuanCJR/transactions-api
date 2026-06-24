import { Account } from '../../../domain/models/account.model';

export class AccountResponseDto {
  public readonly id: string;
  public readonly holderName: string;
  public readonly balance: {
    amount: number;
    currency: string;
  };

  private constructor(account: Account) {
    this.id = account.getId();
    this.holderName = account.getHolderName();
    this.balance = {
      amount: account.getBalance().getAmount(),
      currency: account.getBalance().getCurrency(),
    };
  }

  public static fromDomain(account: Account): AccountResponseDto {
    return new AccountResponseDto(account);
  }
}
