import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Auth } from './decorator/auth.decorator';
import { User } from './decorator/user.decorator';
import { Body, Get, Param, Post, Query } from '@nestjs/common/decorators';

import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
import CheckAccountDto from './dto/checkAccount.dto';
import ResetPwdDto from './dto/resetPwd.dto';

import { Role } from './guards/role/config';
import { user as UserType } from '@prisma/client';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @Post('check')
  check(@Body() body: CheckAccountDto) {
    return this.auth.check(body);
  }

  @Post('resetPwd')
  resetPwd(@Body() body: ResetPwdDto) {
    return this.auth.resetPwd(body);
  }

  @Post('identify')
  @Auth(Role.ADMIN, Role.USER)
  getUser(@User() user: UserType) {
    return this.auth.identify(user);
  }

  @Get('getAll')
  @Auth(Role.ADMIN)
  getAllUsers() {
    return this.auth.getAll();
  }

  @Get('/getUserInfo/:id')
  getUserInfo(@Param('id') id: string) {
    return this.auth.getUserInfo(id);
  }

  @Get('getTopUserList')
  getTopUserList(@Query('page') page: number, @Query('row') row: number) {
    return this.auth.getTopUserList(page, row);
  }
}
