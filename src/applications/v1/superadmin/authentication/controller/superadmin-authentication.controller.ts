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
import { JwtSuperAdminDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from 'src/commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from 'src/commons/v1/interceptors/response.interceptor';
import { RolesGuard } from 'src/commons/v1/jwt/roles.guard';
import { SuperAdminPostSignInDto } from '../dtos/superadmin-post-signin.dto';
import { SuperAdminPostSignInVerifyOtpDto } from '../dtos/superadmin-post-signinVerifyOtp.dto';
import { SuperAdminAuthenticationService } from '../service/superadmin-authentication.service';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class SuperAdminAuthenticationController {
  constructor(private readonly superAdminService: SuperAdminAuthenticationService) { }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() body: SuperAdminPostSignInDto) {
    return await this.superAdminService.signInGenerateOtp(body, 'en');
  }

  @Post('/signin-verify-otp')
  @HttpCode(200)
  async internalSignInVerifyOtp(@Body() body: SuperAdminPostSignInVerifyOtpDto) {
    return await this.superAdminService.signInVerifyOtp(body);
  }


  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(Role.SUPERADMIN)
  async getMe(@Request() req: JwtSuperAdminDto) {
    return await this.superAdminService.getMe(req);
  }
}
