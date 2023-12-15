import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Request, Response } from "express";
import { TOKENS } from "src/enums/tokens.enum";
import { REFRESH_TOKEN_EXPIRATION_MS } from "src/constants";
import { RefreshTokenGuard } from "./guards";
import { Public } from "../common/decorators";
import { UserDtoWithRolesAndAccessToken } from "./types";
import { UserWithRoles } from "src/common/types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.OK)
  async signup(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDtoWithRolesAndAccessToken> {
    const { accessToken, refreshToken, user } =
      await this.authService.signup(authDto);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });

    return { user, accessToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(TOKENS.REFRESH_TOKEN);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userFromRequest = request.user;

    const { accessToken, refreshToken, user } = await this.authService.refresh(
      userFromRequest as UserWithRoles,
    );

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });

    return { user, accessToken };
  }
}
