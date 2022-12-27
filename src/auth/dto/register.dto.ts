import { IsNotEmpty } from 'class-validator';
import { IsNotExistsRule } from 'src/common/rules/is-not-exists.rule';

export default class RegisterDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsNotExistsRule('user', { message: 'User exists, please check..' })
  name: string;
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
