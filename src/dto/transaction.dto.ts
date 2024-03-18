import { IsNotEmpty, IsString } from "class-validator";

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  service_code!: string;
}
