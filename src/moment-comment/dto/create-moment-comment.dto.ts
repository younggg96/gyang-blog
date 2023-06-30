import { IsNotEmpty } from 'class-validator';

export class CreateMomentCommentDto {
  @IsNotEmpty({ message: "moment id couldn't be empty" })
  momentId: number;
  @IsNotEmpty({ message: "content couldn't be empty" })
  content: string;
  parentId?: number;
  replyTo?: number;
}
