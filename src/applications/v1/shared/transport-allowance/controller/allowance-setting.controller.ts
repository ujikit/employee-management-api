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
import { AllowanceSettingService } from '../service/allowance-setting.service';

@ApiTags('Allowance Setting')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowanceSettingController {
  constructor(private readonly allowanceSettingService: AllowanceSettingService) { }

  @ApiOperation({ summary: 'Get active transport allowance setting' })
  @Get('setting')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getMe(@Request() req: JwtDto) {
    return await this.allowanceSettingService.getAllowanceSetting(req);
  }
}
