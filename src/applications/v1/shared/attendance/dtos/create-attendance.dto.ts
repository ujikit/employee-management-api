import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsInt, 
  IsNumber, 
  IsEnum,
  IsIn, 
  Matches,
  IsArray,
  ValidateNested
} from 'class-validator';
import { AttendanceType, AttendanceStatus } from '@prisma/client';

export class CreateAttendanceItemDto {
  @IsNotEmpty({ message: 'employee_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'employee_id|translation.CLASS_VALIDATION.IS_INT' })
  employee_id: number;

  @IsOptional()
  @IsInt({ message: 'attendance_import_id|translation.CLASS_VALIDATION.IS_INT' })
  attendance_import_id?: number;

  @IsNotEmpty({ message: 'attendance_date|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'attendance_date|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  attendance_date: string;

  @IsOptional()
  @IsString({ message: 'checkin_at|translation.CLASS_VALIDATION.IS_STRING' })
  checkin_at?: string;

  @IsOptional()
  @IsString({ message: 'checkout_at|translation.CLASS_VALIDATION.IS_STRING' })
  checkout_at?: string;

  @IsOptional()
  @IsIn(['Gedung Utama', 'Gedung A', 'Gedung B'], { message: 'checkin_location|translation.CLASS_VALIDATION.IS_IN_LOCATION' })
  checkin_location?: string;

  @IsOptional()
  @IsIn(['Gedung Utama', 'Gedung A', 'Gedung B'], { message: 'checkout_location|translation.CLASS_VALIDATION.IS_IN_LOCATION' })
  checkout_location?: string;

  @IsNotEmpty({ message: 'attendance_type|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEnum(AttendanceType, { message: 'attendance_type|translation.CLASS_VALIDATION.IS_IN_ATTENDANCE_TYPE' })
  attendance_type: AttendanceType;

  @IsOptional()
  @IsNumber({}, { message: 'duration_hours|translation.CLASS_VALIDATION.IS_NUMBER' })
  duration_hours?: number;

  @IsNotEmpty({ message: 'status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEnum(AttendanceStatus, { message: 'status|translation.CLASS_VALIDATION.IS_IN_STATUS' })
  status: AttendanceStatus;

  @IsOptional()
  @IsIn(['Disetujui', 'Ditolak'], { message: 'verification_status|translation.CLASS_VALIDATION.IS_IN_VERIFICATION' })
  verification_status?: string;

  @IsOptional()
  @IsIn(['Lead', 'Manager', 'HRD'], { message: 'verified_by_role|translation.CLASS_VALIDATION.IS_IN_ROLE' })
  verified_by_role?: string;

  @IsOptional()
  @IsString({ message: 'remarks|translation.CLASS_VALIDATION.IS_STRING' })
  remarks?: string;
}

export class CreateAttendanceBatchDto {
  @IsArray({ message: 'attendances|translation.CLASS_VALIDATION.IS_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceItemDto)
  attendances: CreateAttendanceItemDto[];
}
