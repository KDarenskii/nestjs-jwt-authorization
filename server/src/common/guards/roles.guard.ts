import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_METADATA_KEY } from "../../auth/decorators";
import { ROLE } from "src/enums";
import { UserWithRoles } from "../types";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles: ROLE[] = this.reflector.getAllAndOverride(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserWithRoles = request.user;

    const hasAllowedRole = user.roles.some((userRole) =>
      allowedRoles.some((allowedRole) => allowedRole === userRole.name),
    );

    return hasAllowedRole;
  }
}
