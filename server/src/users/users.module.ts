import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AccessTokenStrategy } from "src/auth/strategies/access-token.strategy";

@Module({
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
