import { UserDtoWithRoles } from "src/common/types";

export interface UserDtoWithRolesAndAccessToken {
  user: UserDtoWithRoles<string[]>;
  accessToken: string;
}

export interface UserDtoWithRolesAndTokens {
  user: UserDtoWithRoles<string[]>;
  accessToken: string;
  refreshToken: string;
}
