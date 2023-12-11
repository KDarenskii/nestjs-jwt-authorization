import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { AuthResponse } from "./types";
import { Response } from "express";
import { TOKENS } from "src/enums/tokens.enum";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(authDto);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60,
    });

    return { user, accessToken };
  }

  @Post("signup")
  @HttpCode(HttpStatus.OK)
  async signup(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken, user } =
      await this.authService.signup(authDto);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60,
    });

    return { user, accessToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    // mb should set options given to response.cookie()
    response.clearCookie(TOKENS.REFRESH_TOKEN);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh() {}
}
