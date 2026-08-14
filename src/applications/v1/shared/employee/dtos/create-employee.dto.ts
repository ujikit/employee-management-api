import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEmail, 
  Matches, 
  MinLength, 
  IsNumber, 
  Max, 
  IsArray, 
  ValidateNested, 
  IsInt, 
  Min,
  IsIn
} from 'class-validator';

export class EducationItemDto {
  @ApiProperty({ example: 'S1' })
  @IsNotEmpty({ message: 'education_level|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'education_level|translation.CLASS_VALIDATION.IS_STRING' })
  education_level: string;

  @ApiProperty({ example: 'Universitas Gadjah Mada' })
  @IsNotEmpty({ message: 'school_name|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'school_name|translation.CLASS_VALIDATION.IS_STRING' })
  school_name: string;

  @ApiProperty({ example: 2022 })
  @IsNotEmpty({ message: 'graduation_year|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'graduation_year|translation.CLASS_VALIDATION.IS_INT' })
  @Min(1900, { message: 'graduation_year|translation.CLASS_VALIDATION.MIN' })
  graduation_year: number;
}

export class CreateEmployeeDto {
  @ApiPropertyOptional({ example: '/uploads/photos/employee1.jpg' })
  @IsOptional()
  @IsString({ message: 'photo_path|translation.CLASS_VALIDATION.IS_STRING' })
  photo_path?: string;

  @ApiProperty({ example: '19950101' })
  @IsNotEmpty({ message: 'nip|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @MinLength(8, { message: 'nip|translation.CLASS_VALIDATION.MIN_LENGTH_8' })
  @Matches(/^[0-9]+$/, { message: 'nip|translation.CLASS_VALIDATION.NUMERIC_ONLY' })
  nip: string;

  @ApiProperty({ example: 'Fauzi' })
  @IsNotEmpty({ message: 'name|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^[a-zA-Z0-9' ]+$/, { message: 'name|translation.CLASS_VALIDATION.ALPHANUMERIC_SPECIAL' })
  name: string;

  @ApiProperty({ example: 'fauzi@example.com' })
  @IsNotEmpty({ message: 'email|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email: string;

  @ApiProperty({ example: '+628123456789' })
  @IsNotEmpty({ message: 'phone|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'phone|translation.CLASS_VALIDATION.INTERNATIONAL_FORMAT' })
  phone: string;

  @ApiProperty({ example: 'Yogyakarta' })
  @IsNotEmpty({ message: 'birth_place|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'birth_place|translation.CLASS_VALIDATION.IS_STRING' })
  birth_place: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'district_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'district_id|translation.CLASS_VALIDATION.IS_INT' })
  district_id: number;

  @ApiProperty({ example: 'Jl. Malioboro No. 12' })
  @IsNotEmpty({ message: 'full_address|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'full_address|translation.CLASS_VALIDATION.IS_STRING' })
  full_address: string;

  @ApiProperty({ example: 12.5 })
  @IsNotEmpty({ message: 'distance_km|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsNumber({}, { message: 'distance_km|translation.CLASS_VALIDATION.IS_NUMBER' })
  @Max(99, { message: 'distance_km|translation.CLASS_VALIDATION.MAX_2_DIGITS' })
  distance_km: number;

  @ApiProperty({ example: '1995-05-20' })
  @IsNotEmpty({ message: 'birth_date|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birth_date|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  birth_date: string;

  @ApiProperty({ example: 'tidak kawin', enum: ['kawin', 'tidak kawin'] })
  @IsNotEmpty({ message: 'marital_status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['kawin', 'tidak kawin'], { message: 'marital_status|translation.CLASS_VALIDATION.IS_IN_MARITAL' })
  marital_status: string;

  @ApiProperty({ example: 0 })
  @IsNotEmpty({ message: 'children_count|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'children_count|translation.CLASS_VALIDATION.IS_INT' })
  @Max(99, { message: 'children_count|translation.CLASS_VALIDATION.MAX_2_DIGITS' })
  children_count: number;

  @ApiProperty({ example: '2022-01-01' })
  @IsNotEmpty({ message: 'joined_at|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'joined_at|translation.CLASS_VALIDATION.YYYY_MM_DD' })
  joined_at: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'position_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'position_id|translation.CLASS_VALIDATION.IS_INT' })
  position_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'department_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsInt({ message: 'department_id|translation.CLASS_VALIDATION.IS_INT' })
  department_id: number;

  @ApiProperty({ example: 'PKWTT', enum: ['PKWTT', 'PKWT', 'MAGANG'] })
  @IsNotEmpty({ message: 'employment_type|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['PKWTT', 'PKWT', 'MAGANG'], { message: 'employment_type|translation.CLASS_VALIDATION.IS_IN_TYPE' })
  employment_type: 'PKWTT' | 'PKWT' | 'MAGANG';

  @ApiProperty({ type: [EducationItemDto] })
  @IsNotEmpty({ message: 'educations|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsArray({ message: 'educations|translation.CLASS_VALIDATION.IS_ARRAY' })
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  educations: EducationItemDto[];

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsNotEmpty({ message: 'status|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsIn(['ACTIVE', 'INACTIVE'], { message: 'status|translation.CLASS_VALIDATION.IS_IN_STATUS' })
  status: 'ACTIVE' | 'INACTIVE';
}
