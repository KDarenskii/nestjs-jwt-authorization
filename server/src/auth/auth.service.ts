import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, UserDtoWithRolesAndTokens } from "./types";
import * as bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_EXPIRATION_SEC,
  REFRESH_TOKEN_EXPIRATION_SEC,
} from "src/constants";
import { RolesService } from "src/roles/roles.service";
import { UserWithRoles } from "src/common/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {}

  async login(authDto: AuthDto) {
    const { email, password: incomingPassword } = authDto;

    const user = await this.usersService.get({ where: { email } });

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

    const roles = await this.rolesService.get({
      where: { users: { some: { id: user.id } } },
    });

    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto(user);
    const transformedRoles = roles.map((role) => role.name);

    return {
      userDto: { ...userDto, roles: transformedRoles },
      accessToken,
      refreshToken,
    };
  }

  async signup(authDto: AuthDto): Promise<UserDtoWithRolesAndTokens> {
    const user = await this.usersService.create(authDto);
    const roles = await this.rolesService.get({
      where: { users: { some: { id: user.id } } },
    });

    const tokensPayload: JwtPayload = { sub: user.id, email: user.email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto(user);
    const transformedRoles = roles.map((role) => role.name);

    return {
      user: { ...userDto, roles: transformedRoles },
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: UserWithRoles): Promise<UserDtoWithRolesAndTokens> {
    const { email, id, password, roles } = user;

    const tokensPayload: JwtPayload = { sub: id, email: email };

    const { accessToken, refreshToken } =
      await this.generateTokens(tokensPayload);

    const userDto = this.usersService.extractUserDto({ email, id, password });
    const transformedRoles = roles.map((role) => role.name);

    return {
      user: { ...userDto, roles: transformedRoles },
      accessToken,
      refreshToken,
    };
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
