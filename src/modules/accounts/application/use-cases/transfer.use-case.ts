
import { Money } from "../../domain/models/money.vo";
import { AccountRepository } from "../../domain/repositories/account.repository";
import { TransferInputDto } from "../dtos/transfer-input.dto";

export class TransferUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: TransferInputDto): Promise<void> {
    const fromAccount = await this.accountRepository.findById(input.fromAccountId);
    if (!fromAccount) {
      throw new Error(`La cuenta de origen ${input.fromAccountId} no existe.`);
    }

    const toAccount = await this.accountRepository.findById(input.toAccountId);
    if (!toAccount) {
      throw new Error(`La cuenta de destino ${input.toAccountId} no existe.`);
    }

    const amountMoney = Money.create(input.amount, input.currency);

    // Ejecutamos las reglas del dominio
    fromAccount.withdraw(amountMoney);
    toAccount.deposit(amountMoney);

    // Guardamos los cambios usando el repositorio de dominio
    await this.accountRepository.save(fromAccount);
    await this.accountRepository.save(toAccount);
  }
}
