import { TransferUseCase } from '../../ports/inbound/transfer.use-case';
import { Money } from '../../domain/models/money.vo';
import { AccountRepositoryPort } from '../../ports/outbound/account.repository.port';

export class TransferService implements TransferUseCase {
  constructor(
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  public async execute(
    fromAccountId: string,
    toAccountId: string,
    amount: Money,
  ): Promise<void> {
    const fromAccount = await this.accountRepository.findById(fromAccountId);
    if (!fromAccount) {
      throw new Error(`La cuenta de origen ${fromAccountId} no existe.`);
    }

    const toAccount = await this.accountRepository.findById(toAccountId);
    if (!toAccount) {
      throw new Error(`La cuenta de destino ${toAccountId} no existe.`);
    }

    // Reglas de negocio del dominio
    fromAccount.withdraw(amount);
    toAccount.deposit(amount);

    // Persistimos usando el puerto
    await this.accountRepository.save(fromAccount);
    await this.accountRepository.save(toAccount);
  }
}
