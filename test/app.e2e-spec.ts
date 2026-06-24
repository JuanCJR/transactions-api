import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Accounts (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('debería crear una cuenta corriente exitosamente (POST /accounts)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        holderName: 'Diego Maradona',
        initialAmount: 500000,
        currency: 'CLP',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.holderName).toBe('Diego Maradona');
    expect(response.body.balance).toEqual({
      amount: 500000,
      currency: 'CLP',
    });
  });

  it('debería fallar la creación si el saldo inicial es negativo (POST /accounts)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        holderName: 'Titular Erróneo',
        initialAmount: -100,
        currency: 'CLP',
      })
      .expect(400);

    expect(response.body.message).toContain('El balance inicial no puede ser negativo');
  });

  it('debería rechazar la creación si el cliente tiene bajo score crediticio (POST /accounts)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        holderName: 'Juan Deudor Moroso',
        initialAmount: 50000,
        currency: 'CLP',
      })
      .expect(400);

    expect(response.body.errorCode).toBe('CREDIT_SCORE_TOO_LOW');
    expect(response.body.message).toContain('no califica para abrir una cuenta. Score:');
  });

  it('debería rechazar la creación si el cliente tiene deudas activas (POST /accounts)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        holderName: 'Juan Moroso',
        initialAmount: 50000,
        currency: 'CLP',
      })
      .expect(400);

    expect(response.body.errorCode).toBe('CREDIT_SCORE_TOO_LOW');
    expect(response.body.message).toContain('Deudas Activas: SÍ');
  });

  afterEach(async () => {
    await app.close();
  });
});
