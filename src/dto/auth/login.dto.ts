import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/.{8,}/)
  password!: string;
}
