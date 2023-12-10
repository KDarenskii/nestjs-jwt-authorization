import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const user = await this.getByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException("Email is already existing");
    }

    return this.prismaService.user.create({ data: createUserDto });
  }
}
