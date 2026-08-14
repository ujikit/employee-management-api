import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested
} from 'class-validator';

export class CreateAttendanceItemDto {
  @ApiProperty({ example: 1, description: 'ID of the employee' })
  @IsNotEmpty({ message: 'employee_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'employee_id|translation.CLASS_VALIDATION.IS_INT' })
  employee_id: number;

  @ApiPropertyOptional({ example: 1, description: 'Attendance import batch ID' })
  @IsOptional()
  @IsInt({ message: 'attendance_import_id|translation.CLASS_VALIDATION.IS_INT' })
  attendance_import_id?: number;

  @ApiProperty({ example: '2026-08-13', description: 'Date of attendance in YYYY-MM-DD' })
  @IsNotEmpty({ message: 'attendance_date|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'attendance_date|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  attendance_date: string;

  @ApiPropertyOptional({ example: '2026-08-13 08:00:00' })
  @IsOptional()
  @IsString({ message: 'checkin_at|translation.CLASS_VALIDATION.IS_STRING' })
  checkin_at?: string;

  @ApiPropertyOptional({ example: '2026-08-13 17:00:00' })
  @IsOptional()
  @IsString({ message: 'checkout_at|translation.CLASS_VALIDATION.IS_STRING' })
  checkout_at?: string;

  @ApiPropertyOptional({ example: 'Gedung Utama', enum: ['Gedung Utama', 'Gedung A', 'Gedung B'] })
  @IsOptional()
  @IsIn(['Gedung Utama', 'Gedung A', 'Gedung B'], { message: 'checkin_location|translation.CLASS_VALIDATION.IS_IN_LOCATION' })
  checkin_location?: string;

  @ApiPropertyOptional({ example: 'Gedung Utama', enum: ['Gedung Utama', 'Gedung A', 'Gedung B'] })
  @IsOptional()
  @IsIn(['Gedung Utama', 'Gedung A', 'Gedung B'], { message: 'checkout_location|translation.CLASS_VALIDATION.IS_IN_LOCATION' })
  checkout_location?: string;

  @ApiProperty({ enum: ['HADIR', 'CUTI', 'IZIN', 'UNPAID_LEAVE'], example: 'HADIR' })
  @IsNotEmpty({ message: 'attendance_type|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEnum(['HADIR', 'CUTI', 'IZIN', 'UNPAID_LEAVE'], { message: 'attendance_type|translation.CLASS_VALIDATION.IS_IN_ATTENDANCE_TYPE' })
  attendance_type: ['HADIR', 'CUTI', 'IZIN', 'UNPAID_LEAVE'];

  @ApiPropertyOptional({ example: 9 })
  @IsOptional()
  @IsNumber({}, { message: 'duration_hours|translation.CLASS_VALIDATION.IS_NUMBER' })
  duration_hours?: number;

  @ApiProperty({ enum: ['TERPENUHI', 'TIDAK_TERPENUHI'], example: 'TERPENUHI' })
  @IsNotEmpty({ message: 'status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEnum(['TERPENUHI', 'TIDAK_TERPENUHI'], { message: 'status|translation.CLASS_VALIDATION.IS_IN_STATUS' })
  status: ['TERPENUHI', 'TIDAK_TERPENUHI'];

  @ApiPropertyOptional({ example: 'Disetujui', enum: ['Disetujui', 'Ditolak'] })
  @IsOptional()
  @IsIn(['Disetujui', 'Ditolak'], { message: 'verification_status|translation.CLASS_VALIDATION.IS_IN_VERIFICATION' })
  verification_status?: string;

  @ApiPropertyOptional({ example: 'HRD', enum: ['Lead', 'Manager', 'HRD'] })
  @IsOptional()
  @IsIn(['Lead', 'Manager', 'HRD'], { message: 'verified_by_role|translation.CLASS_VALIDATION.IS_IN_ROLE' })
  verified_by_role?: string;

  @ApiPropertyOptional({ example: 'Datang tepat waktu' })
  @IsOptional()
  @IsString({ message: 'remarks|translation.CLASS_VALIDATION.IS_STRING' })
  remarks?: string;
}

export class CreateAttendanceBatchDto {
  @ApiProperty({ type: [CreateAttendanceItemDto] })
  @IsArray({ message: 'attendances|translation.CLASS_VALIDATION.IS_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceItemDto)
  attendances: CreateAttendanceItemDto[];
}
