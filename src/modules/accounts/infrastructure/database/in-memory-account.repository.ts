import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/models/account.model';
import { AccountRepository } from '../../domain/repositories/account.repository';


@Injectable()
export class InMemoryAccountRepository implements AccountRepository {
  // Almacén en memoria simulando la base de datos
  private readonly accounts = new Map<string, Account>();

  public async findById(id: string): Promise<Account | null> {
    const account = this.accounts.get(id);
    if (!account) {
      return null;
    }
    
    // Retornamos una nueva instancia para simular el comportamiento de una base de datos real
    // (donde obtienes una copia limpia de los datos y no la misma referencia en memoria).
    return new Account(
      account.getId(),
      account.getHolderName(),
      account.getBalance(),
    );
  }

  public async save(account: Account): Promise<void> {
    this.accounts.set(account.getId(), account);
  }
}
