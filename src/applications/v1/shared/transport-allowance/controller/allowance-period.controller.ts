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
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from 'src/commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from 'src/commons/v1/interceptors/response.interceptor';
import { RolesGuard } from 'src/commons/v1/jwt/roles.guard';
import { AllowancePeriodService } from '../service/allowance-period.service';

@ApiTags('Allowance Period')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowancePeriodController {
  constructor(private readonly allowancePeriodService: AllowancePeriodService) { }

  @ApiOperation({ summary: 'Get transport allowance periods' })
  @Get('period')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getMe(@Request() req: JwtDto) {
    return await this.allowancePeriodService.getAllowancePeriod(req);
  }
}
