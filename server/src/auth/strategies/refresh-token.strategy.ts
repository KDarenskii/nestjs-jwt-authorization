import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { TOKENS } from "src/enums/tokens.enum";
import { JwtPayload } from "../types";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token",
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = this.usersService.getByEmail(payload.email);

    return user;
  }
}

function cookieExtractor(request: Request) {
  if (request && request.cookies) {
    return request.cookies[TOKENS.REFRESH_TOKEN] ?? null;
  }
  return null;
}
