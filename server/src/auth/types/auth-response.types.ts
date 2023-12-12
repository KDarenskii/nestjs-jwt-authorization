import { UserDto } from "src/common/dto/user.dto";

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface UserTokens {
  userDto: UserDto;
  accessToken: string;
  refreshToken: string;
}
