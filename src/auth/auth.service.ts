import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './guards/role/config';
import { paginate, sleep } from 'src/helper/helper';
import { user as UserType } from '@prisma/client';
import { hash, verify } from 'argon2';
// service
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt/dist';
import { PrismaService } from 'src/prisma/prisma.service';
// dto
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import ResetPwdDto from './dto/resetPwd.dto';
import CheckAccountDto from './dto/checkAccount.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private profileService: ProfileService, private jwt: JwtService) {}

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
    const profile = await this.profileService.findOne(user.email);
    await sleep(3000);
    delete user.password;
    return { user, profile };
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
    await this.prisma.profile.create({
      data: {
        backgroundImg:
          'https://images.unsplash.com/photo-1676085272653-5e77875eed3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80',
        bio: 'There is nothing',
        github: '',
        linkedin: '',
        facebook: '',
        userEmail: dto.email,
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
