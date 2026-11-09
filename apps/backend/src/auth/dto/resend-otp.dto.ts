import { IsUUID } from 'class-validator';

export class ResendOtpDto {
  @IsUUID()
  registrationId: string;
}
