import { GetAccountUseCase } from '../../ports/inbound/get-account.use-case';
import { Account } from '../models/account.model';
import { AccountRepositoryPort } from '../../ports/outbound/account.repository.port';

export class GetAccountService implements GetAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  public async execute(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error(`La cuenta con ID ${accountId} no existe.`);
    }
    return account;
  }
}
