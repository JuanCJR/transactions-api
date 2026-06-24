import { Account } from '../../domain/models/account.model';

export abstract class GetAccountUseCase {
  abstract execute(accountId: string): Promise<Account>;
}
