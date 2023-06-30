import { Module } from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { MomentCommentController } from './moment-comment.controller';
import { MomentService } from 'src/moment/moment.service';

@Module({
  controllers: [MomentCommentController],
  providers: [MomentCommentService, MomentService],
  exports: [MomentCommentService],
})
export class MomentCommentModule {}
