import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { PostSignInDto } from '../dtos/post-signin.dto';
import { PostSignInVerifyOtpDto } from '../dtos/post-signinVerifyOtp.dto';
import { AuthenticationService } from '../service/authentication.service';

@ApiTags('Authentication')
@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AuthenticationController {
  constructor(private readonly superAdminService: AuthenticationService) { }

  @ApiOperation({ summary: 'Sign in and generate OTP' })
  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() body: PostSignInDto) {
    return await this.superAdminService.signInGenerateOtp(body, 'en');
  }

  @ApiOperation({ summary: 'Verify OTP for sign in' })
  @Post('signin-verify-otp')
  @HttpCode(200)
  async internalSignInVerifyOtp(@Body() body: PostSignInVerifyOtpDto) {
    return await this.superAdminService.signInVerifyOtp(body);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getMe(@Request() req: JwtDto) {
    return await this.superAdminService.getMe(req);
  }
}
