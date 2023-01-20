import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt/dist';
import { user as UserType } from '@prisma/client';
// dto
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import ResetPwdDto from './dto/resetPwd.dto';
import CheckAccountDto from './dto/checkAccount.dto';
import { Role } from './guards/role/config';
import { paginate } from 'src/helper/helper';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getAll() {
    return await this.prisma.user.findMany();
  }

  async getTopUserList(p: number, r: number) {
    const page = +p; // sting -> number
    const row = +r; // sting -> number
    const total = await this.prisma.user.count();
    const topUsers = await this.prisma.user.findMany({
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      include: {
        articles: true,
      },
    });
    return paginate({ page, data: topUsers, total, row });
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

  async getUserInfo(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    delete user.password;
    return { user };
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
        role: Role.USER,
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

  async identify(user: UserType) {
    delete user.password;
    return { user, identified: true };
  }

  private async token({ id, email }) {
    return await this.jwt.signAsync({
      email,
      sub: id,
    });
  }
}
