import {
  Controller,
  Get,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from 'src/commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from 'src/commons/v1/interceptors/response.interceptor';
import { RolesGuard } from 'src/commons/v1/jwt/roles.guard';
import { AllowancePeriodService } from '../service/allowance-period.service';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowancePeriodController {
  constructor(private readonly allowancePeriodService: AllowancePeriodService) { }

  @Get('period')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(Role.SUPERADMIN)
  async getMe(@Request() req: JwtDto) {
    return await this.allowancePeriodService.getAllowancePeriod(req);
  }
}
