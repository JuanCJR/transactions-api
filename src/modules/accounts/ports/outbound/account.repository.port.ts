import { Account } from '../../domain/models/account.model';

export abstract class AccountRepositoryPort {
  abstract findById(id: string): Promise<Account | null>;
  abstract save(account: Account): Promise<void>;
}
