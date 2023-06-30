import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { UpdateMomentCommentDto } from './dto/update-moment-comment.dto';
import { user as UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MomentService } from 'src/moment/moment.service';

@Injectable()
export class MomentCommentService {
  constructor(private prisma: PrismaService, private config: ConfigService, private momentService: MomentService) {}

  async create(createMomentCommentDto: CreateMomentCommentDto, user: UserType) {
    const newComment = await this.prisma.momentComment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        moment: {
          connect: {
            id: +createMomentCommentDto.momentId,
          },
        },
        content: createMomentCommentDto.content,
      },
    });
    return await this.momentService.findOneByUser(+newComment.momentId, user);
  }

  async createReply(createMomentCommentDto: CreateMomentCommentDto, user: UserType) {
    const newComment = await this.prisma.momentComment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        parent: {
          connect: {
            id: +createMomentCommentDto.parentId,
          },
        },
        moment: {
          connect: {
            id: +createMomentCommentDto.momentId,
          },
        },
        content: createMomentCommentDto.content,
        replyTo: +createMomentCommentDto.replyTo || null,
      },
    });
    return await this.momentService.findOneByUser(+newComment.momentId, user);
  }

  async findOne(id: number) {
    return await this.prisma.momentComment.findUnique({
      where: {
        id: +id,
      },
    });
  }

  update(id: number, updateMomentCommentDto: UpdateMomentCommentDto) {
    return `This action updates a #${id} momentComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} momentComment`;
  }
}
