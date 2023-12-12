import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, UserTokens } from "./types";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import {
  ACCESS_TOKEN_EXPIRATION_SEC,
  REFRESH_TOKEN_EXPIRATION_SEC,
} from "src/constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const { email, password: incomingPassword } = authDto;

    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new NotFoundException("Email is not existing");
    }

    const isPasswordCorrect = await bcrypt.compare(
      incomingPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException("Incorrect password");
    }

    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto(user);

    return { userDto, accessToken, refreshToken };
  }

  async signup(authDto: AuthDto): Promise<UserTokens> {
    const user = await this.usersService.create(authDto);

    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto(user);

    return { userDto, accessToken, refreshToken };
  }

  async refresh(user: User): Promise<UserTokens> {
    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto(user);

    return { userDto, accessToken, refreshToken };
  }

  private async generateTokens(payload: JwtPayload) {
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRATION_SEC,
    });

    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRATION_SEC,
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }
}
