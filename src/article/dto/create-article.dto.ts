import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: "title couldn't be empty" })
  title: string;
  @IsNotEmpty({ message: "content couldn't be empty" })
  content: string;
  @IsNotEmpty({ message: 'please choose category' })
  categoryId: number;
}
