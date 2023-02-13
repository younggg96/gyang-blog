import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createProfileDto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: createProfileDto,
    });
    return profile;
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(email: string) {
    const userProfile = await this.prisma.profile.findFirst({
      where: {
        userEmail: email,
      },
    });
    delete userProfile.userEmail;
    return userProfile;
  }

  // update(id: number, updateProfileDto: UpdateProfileDto) {
  //   return `This action updates a #${id} profile`;
  // }
}
