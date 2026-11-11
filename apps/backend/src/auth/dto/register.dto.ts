import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// The name is also the profile url (/<name>), so it can't clash with a page of the app
const NOT_RESERVED = /^(?!(login|register|dashboard|profile|api)$)/i;

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{2,30}$/, {
    message:
      'Name must be 2-30 letters, numbers, _ or - (no spaces), e.g. suraj',
  })
  @Matches(NOT_RESERVED, { message: 'This name is reserved' })
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  // bcrypt only uses the first 72 bytes of a password
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
