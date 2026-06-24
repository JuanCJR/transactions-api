import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/models/account.model';
import { Money } from '../../domain/models/money.vo';
import { CreateAccountInputDto } from '../dtos/create-account-input.dto';
import { CreditBureauPort } from '../../domain/ports/credit-bureau.port';
import { CreditScoreTooLowException } from '../../domain/exceptions/credit-score-too-low.exception';

export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly creditBureauPort: CreditBureauPort,
  ) {}

  public async execute(input: CreateAccountInputDto): Promise<Account> {
    const report = await this.creditBureauPort.getCreditReport(input.holderName);
    
    const hasLowScore = report.score < 500;
    const isHighRisk = report.riskCategory === 'HIGH';
    const hasDebts = report.hasActiveDebts;

    if (hasLowScore || isHighRisk || hasDebts) {
      throw new CreditScoreTooLowException(
        input.holderName,
        report.score,
        report.riskCategory,
        report.hasActiveDebts,
      );
    }

    const money = Money.create(input.initialAmount, input.currency);
    const randomId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newAccount = new Account(randomId, input.holderName, money);
    
    await this.accountRepository.save(newAccount);
    return newAccount;
  }
}
