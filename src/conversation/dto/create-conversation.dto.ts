import { IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty({ message: "user id couldn't be empty" })
  userIds: number[];
}
