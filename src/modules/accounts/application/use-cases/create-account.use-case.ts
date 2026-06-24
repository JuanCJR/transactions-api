import { Account } from "../../domain/models/account.model";
import { Money } from "../../domain/models/money.vo";
import { AccountRepository } from "../../domain/repositories/account.repository";
import { CreateAccountInputDto } from "../dtos/create-account-input.dto";


// Clase concreta de caso de uso (sin decoradores NestJS)
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: CreateAccountInputDto): Promise<Account> {
    const money = Money.create(input.initialAmount, input.currency);
    
    // Generar un ID simple
    const randomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newAccount = new Account(randomId, input.holderName, money);
    
    await this.accountRepository.save(newAccount);
    return newAccount;
  }
}
