import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { RefreshTokenStrategy } from "./strategies";
import { AccessTokenStrategy } from "./strategies";
import { RolesModule } from "src/roles/roles.module";

@Module({
  imports: [UsersModule, RolesModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
