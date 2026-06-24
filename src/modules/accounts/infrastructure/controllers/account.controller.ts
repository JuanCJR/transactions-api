import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../../application/use-cases/get-account.use-case';
import { TransferUseCase } from '../../application/use-cases/transfer.use-case';
import { CreateAccountHttpDto } from './dto/create-account-http.dto';
import { TransferHttpDto } from './dto/transfer-http.dto';
import { CreateAccountInputDto } from '../../application/dtos/create-account-input.dto';
import { TransferInputDto } from '../../application/dtos/transfer-input.dto';

@Controller('accounts')
export class AccountController {
  // Inyectamos los casos de uso directamente por su tipo de clase
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountUseCase: GetAccountUseCase,
    private readonly transferUseCase: TransferUseCase,
  ) {}

  @Post()
  public async createAccount(@Body() dto: CreateAccountHttpDto) {
    // Convertimos el DTO de infraestructura (HTTP) al DTO puro de la aplicación
    const useCaseInput = new CreateAccountInputDto(
      dto.holderName,
      dto.initialAmount,
      dto.currency,
    );

    const account = await this.createAccountUseCase.execute(useCaseInput);

    // Mapeamos el modelo de dominio al formato de salida HTTP
    // En producción usarías un Mapper o Serializer, pero para el demo
    // retornamos una estructura JSON clara.
    return {
      id: account.getId(),
      holderName: account.getHolderName(),
      balance: {
        amount: account.getBalance().getAmount(),
        currency: account.getBalance().getCurrency(),
      },
    };
  }

  @Get(':id')
  public async getAccount(@Param('id') id: string) {
    const account = await this.getAccountUseCase.execute(id);
    return {
      id: account.getId(),
      holderName: account.getHolderName(),
      balance: {
        amount: account.getBalance().getAmount(),
        currency: account.getBalance().getCurrency(),
      },
    };
  }

  @Post('transfer')
  public async transferFunds(@Body() dto: TransferHttpDto) {
    const useCaseInput = new TransferInputDto(
      dto.fromAccountId,
      dto.toAccountId,
      dto.amount,
      dto.currency,
    );

    await this.transferUseCase.execute(useCaseInput);

    return {
      message: 'Transferencia realizada con éxito',
    };
  }
}
