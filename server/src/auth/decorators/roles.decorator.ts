import { SetMetadata } from "@nestjs/common";
import { ROLE } from "src/enums";

export const ROLES_METADATA_KEY = "roles";
export const Roles = (...roles: ROLE[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
