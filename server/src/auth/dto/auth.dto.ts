import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsEmail(undefined, { message: "Invalid email" })
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
