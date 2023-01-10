import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import RegisterDto from './dto/register.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt/dist';
import LoginDto from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getAll() {
    return await this.prisma.user.findMany();
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
    return this.token(user);
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
    return this.token(user);
  }

  private async token({ id, email }) {
    return {
      token: await this.jwt.signAsync({
        email,
        sub: id,
      }),
    };
  }
}
