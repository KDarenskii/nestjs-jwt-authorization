import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { TOKENS } from "src/enums/tokens.enum";
import { JwtPayload } from "../types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token",
) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return this.prismaService.user.findUnique({
      where: { id: payload.sub },
      include: { roles: true },
    });
  }
}

function cookieExtractor(request: Request) {
  if (request && request.cookies) {
    return request.cookies[TOKENS.REFRESH_TOKEN] ?? null;
  }
  return null;
}
