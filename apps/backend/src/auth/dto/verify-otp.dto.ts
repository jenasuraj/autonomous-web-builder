import { IsUUID, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsUUID()
  registrationId: string;

  @Matches(/^\d{6}$/, { message: 'code must be a 6-digit number' })
  code: string;
}
