import { UserDto } from "src/users/dto/user.dto";

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface UserTokens {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}
