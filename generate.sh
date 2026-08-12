#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Authentication Login Module Generation..."

# 1. Install dependencies if missing
echo "📦 Checking and installing dependencies (bcrypt)..."
yarn add bcrypt @types/bcrypt

# 2. Define target directory structure
BASE_DIR="src/applications/auth"
mkdir -p "$BASE_DIR/dtos"
mkdir -p "$BASE_DIR/service"
mkdir -p "$BASE_DIR/controller"
mkdir -p "$BASE_DIR/module"

# ==========================================================
# 3. GENERATE LOGIN DTO (login.dto.ts)
# ==========================================================
DTO_FILE="$BASE_DIR/dtos/login.dto.ts"

cat << 'EOF' > "$DTO_FILE"
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username or Email or Cellphone of the user', example: 'johndoe' })
  @IsNotEmpty({ message: 'Username, email, or cellphone is required' })
  @IsString()
  credential: string;

  @ApiProperty({ description: 'User password', example: 'Password@123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
EOF

echo "✅ Created DTO at: $DTO_FILE"

# ==========================================================
# 4. GENERATE AUTH SERVICE (auth.service.ts)
# ==========================================================
SERVICE_FILE="$BASE_DIR/service/auth.service.ts"

cat << 'EOF' > "$SERVICE_FILE"
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../../commons/database/database.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { credential, password } = dto;

    // Find user by username, email, or cellphone based on requirements
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          { username: credential },
          { email: credential },
          { cellphone: credential },
        ],
        deleted_at: null,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials or user not found.');
    }

    // Check if user account status is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is inactive. Please contact support.');
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate JWT token payload matching JwtStrategy structure
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role?.code || 'USER',
      language: 'EN',
    };

    const accessToken = this.jwtService.sign(payload);

    // Update last login timestamp
    await this.db.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role?.code,
      },
    };
  }
}
EOF

echo "✅ Created Service at: $SERVICE_FILE"

# ==========================================================
# 5. GENERATE AUTH CONTROLLER (auth.controller.ts)
# ==========================================================
CONTROLLER_FILE="$BASE_DIR/controller/auth.controller.ts"

cat << 'EOF' > "$CONTROLLER_FILE"
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login', description: 'Authenticate user via username/email/cellphone and password.' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT access token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized / Invalid credentials.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
EOF

echo "✅ Created Controller at: $CONTROLLER_FILE"

# ==========================================================
# 6. GENERATE AUTH MODULE (auth.module.ts)
# ==========================================================
MODULE_FILE="$BASE_DIR/module/auth.module.ts"

cat << 'EOF' > "$MODULE_FILE"
import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { DatabaseService } from '../../../commons/database/database.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
EOF

echo "✅ Created Module at: $MODULE_FILE"

echo "🎉 Success! Auth Login feature has been successfully scaffolded inside $BASE_DIR."
echo "💡 Don't forget to import 'AuthModule' into your root application module if it isn't loaded automatically."