import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { exclude } from '../../../../../commons/v1/helpers/exclude';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersQueryDto } from '../dtos/get-users.dto';
import { UpdateUserStatusDto } from '../dtos/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dataBaseService: DatabaseService) { }

  async getUsers(query: GetUsersQueryDto, req: JwtDto) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query?.sort_by || 'id';
    const sortOrder = query?.sort_order || 'asc';

    const orderBy: Record<string, 'asc' | 'desc'> = {
      [sortBy]: sortOrder,
    };

    const [users, total] = await Promise.all([
      this.dataBaseService.user.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          username: true,
          status: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.dataBaseService.user.count({
        where: { deleted_at: null },
      }),
    ]);

    if (!users) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    const formattedData = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role?.name || null,
      status: user.status,
    }));

    return {
      data: formattedData,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    };
  }

  async createUser(body: CreateUserDto, req: JwtDto) {
    const existingEmail = await this.dataBaseService.user.findFirst({
      where: { email: body.email, deleted_at: null },
    });

    if (existingEmail) {
      throw new BadRequestException('translation.VALIDATION.EMAIL_ALREADY_EXISTS');
    }

    const existingUsername = await this.dataBaseService.user.findFirst({
      where: { username: body.username, deleted_at: null },
    });

    if (existingUsername) {
      throw new BadRequestException('translation.VALIDATION.USERNAME_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.dataBaseService.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role_id: body.role_id,
        status: 'ACTIVE',
      },
      include: {
        role: {
          select: { name: true },
        },
      },
    });

    return {
      data: {
        ...exclude(user, ['password']),
        role: user.role?.name || null,
      },
    };
  }

  async updateUserStatus(id: number, body: UpdateUserStatusDto, req: JwtDto) {
    const user = await this.dataBaseService.user.findFirst({
      where: { id, deleted_at: null },
    });

    if (!user) {
      throw new NotFoundException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    const updatedUser = await this.dataBaseService.user.update({
      where: { id },
      data: {
        status: body.status as UserStatus,
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        status: true,
        role: {
          select: { name: true },
        },
      },
    });

    return {
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role.name || null,
        status: updatedUser.status,
      },
    };
  }

  async deleteUser(id: number, req: JwtDto) {
    const user = await this.dataBaseService.user.findFirst({
      where: { id, deleted_at: null },
    });

    if (!user) {
      throw new NotFoundException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    await this.dataBaseService.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      message: 'translation.SUCCESS.DELETED_SUCCESSFULLY',
    };
  }
}
