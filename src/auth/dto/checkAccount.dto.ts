import { IsNotEmpty } from 'class-validator';
import { IsExistsRule } from 'src/common/rules/is-exists.rule';

export default class CheckAccountDto {
  @IsNotEmpty({ message: "Email couldn't be empty" })
  @IsExistsRule('user', {
    message: "Couldn't find your account, please check...",
  })
  email: string;
}
