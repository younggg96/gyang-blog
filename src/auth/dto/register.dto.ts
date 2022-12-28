import { IsNotEmpty } from 'class-validator';
import { IsNotExistsRule } from 'src/common/rules/is-not-exists.rule';

export default class RegisterDto {
  @IsNotEmpty({ message: "Username couldn't be empty" })
  @IsNotExistsRule('user', { message: 'User exists, please check..' })
  name: string;
  @IsNotEmpty({ message: "Password couldn't be empty." })
  password: string;
  @IsNotEmpty({ message: "Comfirm password couldn't be empty." })
  password_confirm: string;
}
