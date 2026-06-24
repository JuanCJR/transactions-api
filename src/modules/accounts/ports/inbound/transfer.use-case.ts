import { Money } from '../../domain/models/money.vo';

export abstract class TransferUseCase {
  abstract execute(
    fromAccountId: string,
    toAccountId: string,
    amount: Money,
  ): Promise<void>;
}
