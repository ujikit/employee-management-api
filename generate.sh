#!/bin/bash

set -e

echo "🚀 Generating Create Employee module..."

BASE_DIR="src/applications/v1/shared/employee"

mkdir -p "$BASE_DIR/dtos"
mkdir -p "$BASE_DIR/service"
mkdir -p "$BASE_DIR/controller"
mkdir -p "$BASE_DIR/module"

# 1. CREATE EMPLOYEE DTO
cat << 'EOF' > "$BASE_DIR/dtos/create-employee.dto.ts"
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEmail, 
  Matches, 
  MinLength, 
  MaxLength, 
  IsNumber, 
  Max, 
  IsEnum, 
  IsArray, 
  ValidateNested, 
  IsInt, 
  Min,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class EducationItemDto {
  @IsNotEmpty({ message: 'education_level|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'education_level|translation.CLASS_VALIDATION.IS_STRING' })
  education_level: string;

  @IsNotEmpty({ message: 'school_name|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'school_name|translation.CLASS_VALIDATION.IS_STRING' })
  school_name: string;

  @IsNotEmpty({ message: 'graduation_year|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'graduation_year|translation.CLASS_VALIDATION.IS_INT' })
  @Min(1900, { message: 'graduation_year|translation.CLASS_VALIDATION.MIN' })
  graduation_year: number;
}

export class CreateEmployeeDto {
  @IsOptional()
  @IsString({ message: 'photo_path|translation.CLASS_VALIDATION.IS_STRING' })
  photo_path?: string;

  @IsNotEmpty({ message: 'nip|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @MinLength(8, { message: 'nip|translation.CLASS_VALIDATION.MIN_LENGTH_8' })
  @Matches(/^[0-9]+$/, { message: 'nip|translation.CLASS_VALIDATION.NUMERIC_ONLY' })
  nip: string;

  @IsNotEmpty({ message: 'name|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^[a-zA-Z0-9' ]+$/, { message: 'name|translation.CLASS_VALIDATION.ALPHANUMERIC_SPECIAL' })
  name: string;

  @IsNotEmpty({ message: 'email|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email: string;

  @IsNotEmpty({ message: 'phone|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phone|translation.CLASS_VALIDATION.INTERNATIONAL_FORMAT' })
  phone: string;

  @IsNotEmpty({ message: 'birth_place|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'birth_place|translation.CLASS_VALIDATION.IS_STRING' })
  birth_place: string;

  @IsNotEmpty({ message: 'district_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'district_id|translation.CLASS_VALIDATION.IS_INT' })
  district_id: number;

  @IsNotEmpty({ message: 'full_address|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'full_address|translation.CLASS_VALIDATION.IS_STRING' })
  full_address: string;

  @IsNotEmpty({ message: 'distance_km|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsNumber({}, { message: 'distance_km|translation.CLASS_VALIDATION.IS_NUMBER' })
  @Max(99, { message: 'distance_km|translation.CLASS_VALIDATION.MAX_2_DIGITS' })
  distance_km: number;

  @IsNotEmpty({ message: 'birth_date|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birth_date|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  birth_date: string;

  @IsNotEmpty({ message: 'marital_status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['kawin', 'tidak kawin'], { message: 'marital_status|translation.CLASS_VALIDATION.IS_IN_MARITAL' })
  marital_status: string;

  @IsNotEmpty({ message: 'children_count|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'children_count|translation.CLASS_VALIDATION.IS_INT' })
  @Max(99, { message: 'children_count|translation.CLASS_VALIDATION.MAX_2_DIGITS' })
  children_count: number;

  @IsNotEmpty({ message: 'joined_at|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'joined_at|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  joined_at: string;

  @IsNotEmpty({ message: 'position_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'position_id|translation.CLASS_VALIDATION.IS_INT' })
  position_id: number;

  @IsNotEmpty({ message: 'department_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'department_id|translation.CLASS_VALIDATION.IS_INT' })
  department_id: number;

  @IsNotEmpty({ message: 'employment_type|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['PKWTT', 'PKWT', 'MAGANG'], { message: 'employment_type|translation.CLASS_VALIDATION.IS_IN_TYPE' })
  employment_type: 'PKWTT' | 'PKWT' | 'MAGANG';

  @IsNotEmpty({ message: 'educations|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsArray({ message: 'educations|translation.CLASS_VALIDATION.IS_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  educations: EducationItemDto[];

  @IsNotEmpty({ message: 'status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['ACTIVE', 'INACTIVE'], { message: 'status|translation.CLASS_VALIDATION.IS_IN_STATUS' })
  status: 'ACTIVE' | 'INACTIVE';
}
EOF

# 2. UPDATE EMPLOYEE SERVICE
cat << 'EOF' > "$BASE_DIR/service/employee.service.ts"
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getEmployee(req: JwtDto) {
    const data = await this.dataBaseService.employee.findMany();

    if (!data) {
      throw new BadRequestException('translation.VALIDATION.NOT_FOUND_INTERNAL');
    }

    return {
      data,
    };
  }

  async createEmployee(req: JwtDto, body: CreateEmployeeDto) {
    const existingNip = await this.dataBaseService.employee.findUnique({
      where: { nip: body.nip },
    });

    if (existingNip) {
      throw new BadRequestException('translation.VALIDATION.NIP_ALREADY_EXISTS');
    }

    const existingEmail = await this.dataBaseService.employee.findUnique({
      where: { email: body.email },
    });

    if (existingEmail) {
      throw new BadRequestException('translation.VALIDATION.EMAIL_ALREADY_EXISTS');
    }

    const { educations, birth_date, joined_at, ...employeeData } = body;

    const result = await this.dataBaseService.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          ...employeeData,
          birth_date: new Date(birth_date),
          joined_at: new Date(joined_at),
          created_by: req.user.id,
        },
      });

      if (educations && educations.length > 0) {
        await tx.employeeEducation.createMany({
          data: educations.map((edu, index) => ({
            employee_id: employee.id,
            education_level: edu.education_level,
            school_name: edu.school_name,
            graduation_year: edu.graduation_year,
            sort_order: index + 1,
          })),
        });
      }

      return tx.employee.findUnique({
        where: { id: employee.id },
        include: {
          employee_educations: true,
          position: true,
          department: true,
          district: {
            include: {
              regency: {
                include: {
                  province: true,
                },
              },
            },
          },
        },
      });
    });

    return {
      data: result,
    };
  }
}
EOF

# 3. UPDATE EMPLOYEE CONTROLLER
cat << 'EOF' > "$BASE_DIR/controller/employee.controller.ts"
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
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from 'src/commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from 'src/commons/v1/interceptors/response.interceptor';
import { RolesGuard } from 'src/commons/v1/jwt/roles.guard';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getEmployee(@Request() req: JwtDto) {
    return await this.employeeService.getEmployee(req);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createEmployee(@Request() req: JwtDto, @Body() body: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(req, body);
  }
}
EOF

# 4. UPDATE EMPLOYEE MODULE
cat << 'EOF' > "$BASE_DIR/module/employee.module.ts"
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { EmployeeController } from '../controller/employee.controller';
import { EmployeeService } from '../service/employee.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    DatabaseService,
    JwtStrategy,
  ],
})
export class EmployeeModule {}
EOF

chmod +x "$BASE_DIR/service/employee.service.ts"
echo "✅ Done! Create Employee features generated successfully in $BASE_DIR."