import { Money } from './money.vo';

describe('Money Value Object', () => {
  it('debería crear una instancia de dinero correctamente', () => {
    const money = Money.create(1000, 'CLP');
    expect(money.getAmount()).toBe(1000);
    expect(money.getCurrency()).toBe('CLP');
  });

  it('debería lanzar un error si el monto es negativo', () => {
    expect(() => Money.create(-50)).toThrow('El monto no puede ser negativo');
  });

  it('debería sumar montos de la misma moneda correctamente', () => {
    const money1 = Money.create(1000, 'CLP');
    const money2 = Money.create(500, 'CLP');
    const result = money1.add(money2);

    expect(result.getAmount()).toBe(1500);
    expect(result).not.toBe(money1); // Inmutabilidad: debe retornar una nueva referencia
  });

  it('debería restar montos de la misma moneda correctamente', () => {
    const money1 = Money.create(1000, 'CLP');
    const money2 = Money.create(300, 'CLP');
    const result = money1.subtract(money2);

    expect(result.getAmount()).toBe(700);
  });

  it('debería lanzar un error al sumar distintas monedas', () => {
    const clp = Money.create(1000, 'CLP');
    const usd = Money.create(10, 'USD');

    expect(() => clp.add(usd)).toThrow(
      'No se pueden operar monedas distintas: CLP y USD',
    );
  });
});
