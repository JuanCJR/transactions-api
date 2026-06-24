import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAccountHttpDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del titular es requerido' })
  public readonly holderName: string;

  @IsNumber()
  @Min(0, { message: 'El balance inicial no puede ser negativo' })
  public readonly initialAmount: number;

  @IsString()
  @IsNotEmpty({ message: 'La moneda es requerida' })
  public readonly currency: string;
}
