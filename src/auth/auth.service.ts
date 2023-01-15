import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt/dist';
import LoginDto from './dto/login.dto';
import CheckAccountDto from './dto/checkAccount.dto';
import ResetPwdDto from './dto/resetPwd.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getAll() {
    return await this.prisma.user.findMany();
  }

  async check(dto: CheckAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    const { email, username, avatar } = user;
    return {
      email,
      username,
      avatar,
      userExist: !!user,
    };
  }

  async resetPwd(dto: ResetPwdDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!(await verify(user.password, dto.old_password))) {
      throw new BadRequestException({ password: 'Incorrect old password, please check...' });
    }
    const newUser = await this.prisma.user.update({
      where: {
        email: dto.email,
      },
      data: { password: await hash(dto.new_password) },
    });
    return { pwdUpdated: true, token: await this.token(newUser) };
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.password_confirm) {
      throw new BadRequestException({ password: 'Password comfirm error, please check...' });
    }
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: await hash(dto.password),
      },
    });
    delete user.password;
    return { user: user, token: await this.token(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!(await verify(user.password, dto.password))) {
      throw new BadRequestException({ password: 'Incorrect password, please check...' });
    }
    delete user.password;
    return { user, token: await this.token(user) };
  }

  private async token({ id, email }) {
    return await this.jwt.signAsync({
      email,
      sub: id,
    });
  }
}
