import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'name|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'name|translation.CLASS_VALIDATION.IS_STRING' })
  name!: string;

  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty({ message: 'username|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsString({ message: 'username|translation.CLASS_VALIDATION.IS_STRING' })
  username!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty({ message: 'email|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsEmail({}, { message: 'email|translation.CLASS_VALIDATION.IS_EMAIL' })
  email!: string;

  @ApiProperty({ example: 'Secret123!' })
  @IsNotEmpty({ message: 'password|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @MinLength(8, { message: 'password|translation.CLASS_VALIDATION.MIN_LENGTH_8' })
  @Matches(/^\S*$/, { message: 'password|translation.CLASS_VALIDATION.NO_SPACES' })
  @Matches(/(?=.*[A-Z])/, { message: 'password|translation.CLASS_VALIDATION.AT_LEAST_ONE_UPPERCASE' })
  @Matches(/(?=.*[a-z])/, { message: 'password|translation.CLASS_VALIDATION.AT_LEAST_ONE_LOWERCASE' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'password|translation.CLASS_VALIDATION.AT_LEAST_ONE_SPECIAL_CHAR' })
  password!: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'role_id|translation.CLASS_VALIDATION.IS_NOT_EMPTY' })
  @IsNumber({}, { message: 'role_id|translation.CLASS_VALIDATION.IS_NUMBER' })
  role_id!: number;

  @ApiProperty({ example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString({ message: 'status|translation.CLASS_VALIDATION.IS_STRING' })
  status?: string = 'ACTIVE';
}