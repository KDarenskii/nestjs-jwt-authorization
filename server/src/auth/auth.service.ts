import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, UserTokens } from "./types";
import * as bcrypt from "bcrypt";

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return { user: userData, accessToken, refreshToken };
  }

  async signup(authDto: AuthDto): Promise<UserTokens> {
    const user = await this.usersService.create(authDto);

    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return { user: userData, accessToken, refreshToken };
  }

  private async generateTokens(payload: JwtPayload) {
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: 30,
    });

    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: 60,
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }
}
