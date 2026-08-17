import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateAllowanceSettingDto } from '../dtos/allowance-setting.dto';
import { AllowanceSettingService } from '../service/allowance-setting.service';

@ApiTags('Transport Allowance Settings')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'setting', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AllowanceSettingController {
  constructor(private readonly allowanceSettingService: AllowanceSettingService) { }

  @ApiOperation({ summary: 'Get transport allowance settings' })
  @Get('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllowanceSetting(@Request() req: JwtDto) {
    return await this.allowanceSettingService.getAllowanceSetting(req);
  }

  @ApiOperation({ summary: 'Update transport allowance settings' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateSetting(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAllowanceSettingDto,
    @Request() req: JwtDto,
  ) {
    return await this.allowanceSettingService.updateSetting(id, body, req);
  }
}