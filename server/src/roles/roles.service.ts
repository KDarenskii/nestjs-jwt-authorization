import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(params?: { where?: Prisma.RoleWhereInput }) {
    return this.prismaService.role.findMany(params);
  }
}
