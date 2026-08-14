import {
  Body,
  Controller,
  Get,
  Post,
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
import { CreateAttendanceBatchDto } from '../dtos/create-attendance.dto';
import { AttendanceService } from '../service/attendance.service';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @ApiOperation({ summary: 'Get all attendance records' })
  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAttendance(@Request() req: JwtDto) {
    return await this.attendanceService.getAttendance(req);
  }

  @ApiOperation({ summary: 'Create batch attendance records and recalculate transport allowance' })
  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createAttendance(
    @Request() req: JwtDto,
    @Body() body: CreateAttendanceBatchDto
  ) {
    return await this.attendanceService.createAttendance(req, body.attendances);
  }
}
