import { BadRequestException, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export default class Validate extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    const messages = {};
    validationErrors.forEach((error) => {
      messages[error.property] = Object.values(error.constraints)[0];
    });

    throw new BadRequestException(messages);
  }
}
