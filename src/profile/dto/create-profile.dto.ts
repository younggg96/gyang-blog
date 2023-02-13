import { IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  backgroundImg: string;
  bio: string;
  github: string;
  linkedin: string;
  facebook: string;
  @IsNotEmpty({ message: "User email couldn't be empty" })
  userEmail: string;
}
