import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail(undefined, { message: "Invalid email" })
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
