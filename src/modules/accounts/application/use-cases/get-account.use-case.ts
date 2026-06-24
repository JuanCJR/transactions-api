import { AccountRepository } from '../../../../../../referencias/domain/repositories/account.repository';
import { Account } from '../../../../../../referencias/domain/models/account.model';

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
