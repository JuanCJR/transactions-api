import { CreateAccountUseCase } from '../../ports/inbound/create-account.use-case';
import { Account } from '../../domain/models/account.model';
import { Money } from '../../domain/models/money.vo';
import { AccountRepositoryPort } from '../../ports/outbound/account.repository.port';

export class CreateAccountService implements CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  public async execute(
    holderName: string,
    initialBalance: Money,
  ): Promise<Account> {
    const randomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newAccount = new Account(randomId, holderName, initialBalance);
    await this.accountRepository.save(newAccount);
    return newAccount;
  }
}
