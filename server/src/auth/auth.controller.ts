import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthResponse } from "./types";
import { Request, Response } from "express";
import { TOKENS } from "src/enums/tokens.enum";
import { User } from "@prisma/client";
import { REFRESH_TOKEN_EXPIRATION_MS } from "src/constants";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, userDto } =
      await this.authService.login(authDto);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });

    return { user: userDto, accessToken };
  }

  @Post("signup")
  @HttpCode(HttpStatus.OK)
  async signup(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken, userDto } =
      await this.authService.signup(authDto);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });

    return { user: userDto, accessToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(TOKENS.REFRESH_TOKEN);
  }

  // here will be refresh guard
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user;

    const { accessToken, refreshToken, userDto } =
      await this.authService.refresh(user as User);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });

    return { user: userDto, accessToken };
  }
}
