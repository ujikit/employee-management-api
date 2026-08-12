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
import { AttendanceService } from '../service/attendance.service';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AttendanceController {
  constructor(private readonly allowancePeriodService: AttendanceService) { }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(Role.SUPERADMIN)
  async getAttendance(@Request() req: JwtDto) {
    return await this.allowancePeriodService.getAttendance(req);
  }
}
