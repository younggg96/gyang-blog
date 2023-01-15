import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common/decorators';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
import { Auth } from './decorator/auth.decorator';
import { Role } from './guards/role/config';
import CheckAccountDto from './dto/checkAccount.dto';
import ResetPwdDto from './dto/resetPwd.dto';

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

  @Post('getAll')
  @Auth(Role.ADMIN)
  getAllUsers() {
    return this.auth.getAll();
  }
}
