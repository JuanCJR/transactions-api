import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TransferInputDto } from '../../../application/dtos/transfer-input.dto';

export class TransferHttpDto {
  @IsString()
  @IsNotEmpty({ message: 'La cuenta de origen es requerida' })
  public readonly fromAccountId: string;

  @IsString()
  @IsNotEmpty({ message: 'La cuenta de destino es requerida' })
  public readonly toAccountId: string;

  @IsNumber()
  @Min(1, { message: 'El monto de la transferencia debe ser al menos 1' })
  public readonly amount: number;

  @IsString()
  @IsNotEmpty({ message: 'La moneda es requerida' })
  public readonly currency: string;

  public toUseCaseInput(): TransferInputDto {
    return new TransferInputDto(
      this.fromAccountId,
      this.toAccountId,
      this.amount,
      this.currency,
    );
  }
}
