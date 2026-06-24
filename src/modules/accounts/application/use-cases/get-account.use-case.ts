import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/models/account.model';

export class GetAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error(`La cuenta con ID ${accountId} no existe.`);
    }
    return account;
  }
}
