import { Account } from '../../domain/models/account.model';
import { Money } from '../../domain/models/money.vo';

export abstract class CreateAccountUseCase {
  abstract execute(holderName: string, initialBalance: Money): Promise<Account>;
}
