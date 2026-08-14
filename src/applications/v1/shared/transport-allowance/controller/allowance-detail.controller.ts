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
import { AllowanceDetailService } from '../service/allowance-detail.service';

@ApiTags('Allowance Detail')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowanceDetailController {
  constructor(private readonly allowanceDetailService: AllowanceDetailService) { }

  @ApiOperation({ summary: 'Get transport allowance details' })
  @Get('detail')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getMe(@Request() req: JwtDto) {
    return await this.allowanceDetailService.getAllowanceDetail(req);
  }
}
