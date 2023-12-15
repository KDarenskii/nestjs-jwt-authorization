import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";
import { Roles } from "src/common/decorators";
import { ROLE } from "src/enums";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async get() {
    return this.usersService.getAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
