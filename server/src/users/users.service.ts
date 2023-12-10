import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({ data: createUserDto });
  }
}
