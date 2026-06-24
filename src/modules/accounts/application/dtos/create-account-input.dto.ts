export class CreateAccountInputDto {
  constructor(
    public readonly holderName: string,
    public readonly initialAmount: number,
    public readonly currency: string = 'CLP',
  ) {}
}
