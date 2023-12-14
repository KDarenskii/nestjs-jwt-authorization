import { Prisma } from "@prisma/client";

export interface UserWithRoles
  extends Prisma.UserGetPayload<{ include: { roles: true } }> {}
