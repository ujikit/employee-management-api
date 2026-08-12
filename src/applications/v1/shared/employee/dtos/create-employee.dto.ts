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
