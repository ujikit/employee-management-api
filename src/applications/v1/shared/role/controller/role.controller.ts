import {
  Controller,
  Get,
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
import { RoleService } from '../service/role.service';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiOperation({ summary: 'Get all user roles' })
  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getRoles(@Request() req: JwtDto) {
    return await this.roleService.getRoles(req);
  }
}
