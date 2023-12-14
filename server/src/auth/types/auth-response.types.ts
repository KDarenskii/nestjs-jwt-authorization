import { UserDto } from "src/common/dto/user.dto";

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface UserDtoWithTokensAndRoles {
  userDto: UserDto & { roles: string[] };
  accessToken: string;
  refreshToken: string;
}
