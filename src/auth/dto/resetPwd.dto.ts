import { IsNotEmpty } from 'class-validator';

export default class ResetPwdDto {
  @IsNotEmpty({ message: "Email couldn't be empty" })
  email: string;
  @IsNotEmpty({
    message: "Password couldn't be empty.",
  })
  old_password: string;
  @IsNotEmpty({
    message: "New password couldn't be empty.",
  })
  new_password: string;
}
