import {
  Body,
  Controller,
  Get,
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
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { GetEmployeeQueryDto } from '../dtos/employee.dto';
import { EmployeeService } from '../service/employee.service';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @ApiOperation({ summary: 'Get all employees with pagination and sorting' })
  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getEmployee(
    @Query() query: GetEmployeeQueryDto,
    @Request() req: JwtDto,
  ) {
    return await this.employeeService.getEmployee(query, req);
  }

  @ApiOperation({ summary: 'Get employment stats (total, kontrak, tetap counts)' })
  @Get('count-employee')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getEmploymentStats(@Request() req: JwtDto) {
    return await this.employeeService.getEmploymentStats(req);
  }

  @ApiOperation({ summary: 'Create a new employee record' })
  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createEmployee(@Request() req: JwtDto, @Body() body: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(req, body);
  }
}
