import { Module } from '@nestjs/common';
import { AccountRepository } from '../domain/repositories/account.repository';
import { InMemoryAccountRepository } from './database/in-memory-account.repository';
import { CreateAccountUseCase } from '../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../application/use-cases/get-account.use-case';
import { TransferUseCase } from '../application/use-cases/transfer.use-case';
import { AccountController } from './controllers/account.controller';

import { LoggerPort } from '../domain/ports/logger.port';
import { NestLoggerAdapter } from './logger/nest-logger.adapter';
import { AppConfig } from '../domain/ports/app-config.port';
import { NestConfigAdapter } from './config/nest-config.adapter';

import { CreditBureauPort } from '../domain/ports/credit-bureau.port';
import { MockCreditBureauAdapter } from './http-clients/mock-credit-bureau.adapter';

@Module({
  controllers: [AccountController],
  providers: [
    {
      provide: AccountRepository,
      useClass: InMemoryAccountRepository,
    },
    {
      provide: LoggerPort,
      useClass: NestLoggerAdapter,
    },
    {
      provide: AppConfig,
      useClass: NestConfigAdapter,
    },
    {
      provide: CreditBureauPort,
      useClass: MockCreditBureauAdapter,
    },
    {
      provide: CreateAccountUseCase,
      useFactory: (
        repository: AccountRepository,
        creditBureau: CreditBureauPort,
      ) => {
        return new CreateAccountUseCase(repository, creditBureau);
      },
      inject: [AccountRepository, CreditBureauPort],
    },
    {
      provide: GetAccountUseCase,
      useFactory: (repository: AccountRepository) => {
        return new GetAccountUseCase(repository);
      },
      inject: [AccountRepository],
    },
    {
      provide: TransferUseCase,
      useFactory: (
        repository: AccountRepository,
        logger: LoggerPort,
        config: AppConfig,
      ) => {
        return new TransferUseCase(repository, logger, config);
      },
      inject: [AccountRepository, LoggerPort, AppConfig],
    },
  ],
})
export class AccountsModule {}
