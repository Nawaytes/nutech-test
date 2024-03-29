import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsNotEmpty()
  @Matches(/.{8,}/)
  password!: string;
}
