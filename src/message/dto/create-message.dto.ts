import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: "message couldn't be empty" })
  content: string;
  @IsNotEmpty({ message: "senderId couldn't be empty" })
  senderId: number;
  @IsNotEmpty({ message: "conversationId couldn't be empty" })
  conversationId: number;
}
