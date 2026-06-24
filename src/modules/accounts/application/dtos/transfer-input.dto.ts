export class TransferInputDto {
  constructor(
    public readonly fromAccountId: string,
    public readonly toAccountId: string,
    public readonly amount: number,
    public readonly currency: string = 'CLP',
  ) {}
}
