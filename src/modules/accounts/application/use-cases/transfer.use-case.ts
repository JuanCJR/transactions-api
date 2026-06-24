import { AccountRepository } from '../../domain/repositories/account.repository';
import { Money } from '../../domain/models/money.vo';
import { TransferInputDto } from '../dtos/transfer-input.dto';
import { LoggerPort } from '../../domain/ports/logger.port';
import { AppConfig } from '../../domain/ports/app-config.port';

export class TransferUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly logger: LoggerPort,
    private readonly appConfig: AppConfig,
  ) {}

  public async execute(input: TransferInputDto): Promise<void> {
    this.logger.log(
      `Iniciando transferencia: ${input.amount} ${input.currency} desde ${input.fromAccountId} hacia ${input.toAccountId}`,
    );

    const maxLimit = this.appConfig.getTransferLimit();
    if (input.amount > maxLimit) {
      const errorMsg = `La transferencia de ${input.amount} supera el límite máximo permitido de ${maxLimit}.`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const fromAccount = await this.accountRepository.findById(input.fromAccountId);
    if (!fromAccount) {
      const errorMsg = `La cuenta de origen ${input.fromAccountId} no existe.`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const toAccount = await this.accountRepository.findById(input.toAccountId);
    if (!toAccount) {
      const errorMsg = `La cuenta de destino ${input.toAccountId} no existe.`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const amountMoney = Money.create(input.amount, input.currency);

    fromAccount.withdraw(amountMoney);
    toAccount.deposit(amountMoney);

    await this.accountRepository.save(fromAccount);
    await this.accountRepository.save(toAccount);

    this.logger.log(
      `Transferencia finalizada con éxito. Cuenta origen: ${input.fromAccountId} (Nuevo Saldo: ${fromAccount.getBalance().getAmount()}), Cuenta destino: ${input.toAccountId}`,
    );
  }
}
