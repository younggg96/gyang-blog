import { IsNotEmpty } from 'class-validator';

export class CreateMomentDto {
  @IsNotEmpty({ message: "content couldn't be empty" })
  content: string;
  @IsNotEmpty({ message: "imgs couldn't exist" })
  imgs: string[];
}
