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
import { AllowanceDetailService } from '../service/allowance-detail.service';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowanceDetailController {
  constructor(private readonly allowanceDetailService: AllowanceDetailService) { }

  @Get('detail')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(Role.SUPERADMIN)
  async getMe(@Request() req: JwtDto) {
    return await this.allowanceDetailService.getAllowanceDetail(req);
  }
}
