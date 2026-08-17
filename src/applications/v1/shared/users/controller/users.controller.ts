import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDto } from '../../../../../commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from '../../../../../commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from '../../../../../commons/v1/interceptors/response.interceptor';
import { RolesGuard } from '../../../../../commons/v1/jwt/roles.guard';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersQueryDto } from '../dtos/get-users.dto';
import { UpdateUserStatusDto } from '../dtos/update-user-status.dto';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Get all users with visible fields' })
  @Get('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUsers(
    @Query() query: GetUsersQueryDto,
    @Request() req: JwtDto,
  ) {
    return await this.usersService.getUsers(query, req);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createUser(
    @Body() body: CreateUserDto,
    @Request() req: JwtDto,
  ) {
    return await this.usersService.createUser(body, req);
  }

  @ApiOperation({ summary: 'Update user status' })
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserStatusDto,
    @Request() req: JwtDto,
  ) {
    return await this.usersService.updateUserStatus(id, body, req);
  }

  @ApiOperation({ summary: 'Soft delete a user' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: JwtDto,
  ) {
    return await this.usersService.deleteUser(id, req);
  }
}
