import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({
    message: "Category couldn't be empty",
  })
  title: string;
}
