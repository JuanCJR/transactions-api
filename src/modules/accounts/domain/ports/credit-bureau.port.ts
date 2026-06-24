export abstract class CreditBureauPort {
  abstract getCreditScore(holderName: string): Promise<number>;
}
