import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-access-token",
) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
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
