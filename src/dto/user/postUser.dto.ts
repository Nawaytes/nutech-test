import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message:
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
  })
  password!: string;
}
