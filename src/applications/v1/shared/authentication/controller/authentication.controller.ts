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
import { JwtDto } from 'src/commons/v1/dtos/unique-jwt-owner.dto';
import { FilterException } from 'src/commons/v1/interceptors/filter-exception';
import { ResponseInterceptor } from 'src/commons/v1/interceptors/response.interceptor';
import { RolesGuard } from 'src/commons/v1/jwt/roles.guard';
import { PostSignInDto } from '../dtos/post-signin.dto';
import { PostSignInVerifyOtpDto } from '../dtos/post-signinVerifyOtp.dto';
import { AuthenticationService } from '../service/authentication.service';

@Controller({ path: '', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseFilters(FilterException)
export class AuthenticationController {
  constructor(private readonly superAdminService: AuthenticationService) { }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() body: PostSignInDto) {
    return await this.superAdminService.signInGenerateOtp(body, 'en');
  }

  @Post('signin-verify-otp')
  @HttpCode(200)
  async internalSignInVerifyOtp(@Body() body: PostSignInVerifyOtpDto) {
    return await this.superAdminService.signInVerifyOtp(body);
  }


  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(Role.SUPERADMIN)
  async getMe(@Request() req: JwtDto) {
    return await this.superAdminService.getMe(req);
  }
}
