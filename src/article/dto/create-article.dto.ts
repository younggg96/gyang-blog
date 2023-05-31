import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: "title couldn't be empty" })
  title: string;
  @IsNotEmpty({ message: "content couldn't be empty" })
  content: string;
  @IsNotEmpty({ message: "description couldn't be empty" })
  description: string;
  @IsNotEmpty({
    message: "category couldn't be empty",
  })
  categoryIds: number[];
  @IsNotEmpty({
    message: "published couldn't be empty",
  })
  published: boolean;
  img: string;
}
