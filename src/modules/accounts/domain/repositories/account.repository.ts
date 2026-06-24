import { Account } from '../models/account.model';

export abstract class AccountRepository {
  abstract findById(id: string): Promise<Account | null>;
  abstract save(account: Account): Promise<void>;
}
