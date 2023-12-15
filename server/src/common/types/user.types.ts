import { Role, User } from "@prisma/client";

export interface UserDto extends Omit<User, "password"> {}

type UserRoles = Role[] | string[];

export interface UserWithRoles<R extends UserRoles = Role[]> extends User {
  roles: R;
}

export interface UserDtoWithRoles<R extends UserRoles = Role[]>
  extends UserDto {
  roles: R;
}
