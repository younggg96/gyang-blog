import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: "article id couldn't be empty" })
  articleId: number;
  @IsNotEmpty({ message: "content couldn't be empty" })
  content: string;
  parentId?: number;
  replyTo?: number;
}
