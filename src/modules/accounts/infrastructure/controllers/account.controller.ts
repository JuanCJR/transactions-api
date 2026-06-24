import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../../application/use-cases/get-account.use-case';
import { TransferUseCase } from '../../application/use-cases/transfer.use-case';
import { CreateAccountHttpDto } from './dto/create-account-http.dto';
import { TransferHttpDto } from './dto/transfer-http.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';

@Controller('accounts')
@UseFilters(DomainExceptionFilter)
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
    private readonly transferUseCase: TransferUseCase,
  ) {}

  @Post()
  public async createAccount(@Body() dto: CreateAccountHttpDto): Promise<AccountResponseDto> {
    const account = await this.createAccountUseCase.execute(dto.toUseCaseInput());
    return AccountResponseDto.fromDomain(account);
  }

  @Get(':id')
  public async getAccount(@Param('id') id: string): Promise<AccountResponseDto> {
    const account = await this.getAccountUseCase.execute(id);
    return AccountResponseDto.fromDomain(account);
  }

  @Post('transfer')
  public async transferFunds(@Body() dto: TransferHttpDto) {
    await this.transferUseCase.execute(dto.toUseCaseInput());
    return {
      message: 'Transferencia realizada con éxito',
    };
  }
}
