import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/models/account.model';
import { Money } from '../../domain/models/money.vo';
import { CreateAccountInputDto } from '../dtos/create-account-input.dto';
import { CreditScoreTooLowException } from '../../domain/exceptions/credit-score-too-low.exception';
import { CreditBureauPort } from '../../domain/ports/credit-bureau.port';

export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly creditBureauPort: CreditBureauPort,
  ) {}

  public async execute(input: CreateAccountInputDto): Promise<Account> {
    const score = await this.creditBureauPort.getCreditScore(input.holderName);
    if (score < 500) {
      throw new CreditScoreTooLowException(input.holderName, score);
    }

    const money = Money.create(input.initialAmount, input.currency);
    const randomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newAccount = new Account(randomId, input.holderName, money);
    
    await this.accountRepository.save(newAccount);
    return newAccount;
  }
}
