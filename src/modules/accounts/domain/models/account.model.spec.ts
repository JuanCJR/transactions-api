import { Account } from './account.model';
import { Money } from './money.vo';

describe('Account Entity', () => {
  it('debería depositar dinero correctamente en la cuenta', () => {
    const account = new Account('A1', 'Diego Maradona', Money.create(5000, 'CLP'));
    account.deposit(Money.create(2000, 'CLP'));

    expect(account.getBalance().getAmount()).toBe(7000);
  });

  it('debería retirar dinero de la cuenta si tiene saldo suficiente', () => {
    const account = new Account('A1', 'Diego Maradona', Money.create(5000, 'CLP'));
    account.withdraw(Money.create(2000, 'CLP'));

    expect(account.getBalance().getAmount()).toBe(3000);
  });

  it('debería lanzar InsufficientFundsException al intentar retirar más del saldo disponible', () => {
    const account = new Account('A1', 'Diego Maradona', Money.create(1000, 'CLP'));

    expect(() => account.withdraw(Money.create(1500, 'CLP'))).toThrow(
      'La cuenta A1 no tiene fondos suficientes. Requerido: 1500, Disponible: 1000',
    );
  });
});
