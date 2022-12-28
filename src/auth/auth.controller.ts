import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common/decorators';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';

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
}
