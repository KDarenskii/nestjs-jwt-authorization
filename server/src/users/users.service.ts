import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { UserDto } from "src/common";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.user.findMany({
      select: { email: true, id: true },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const { email, password } = createUserDto;

    const user = await this.getByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException("Email is already existing");
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    return this.prismaService.user.create({
      data: { email, password: hashedPassword },
    });
  }

  extractUserDto(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userDto } = user;

    return userDto;
  }
}
