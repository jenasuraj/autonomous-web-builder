import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class InvokeGraphDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000)
  message: string;

  // Omit to start a new conversation; send the returned one back to continue it
  @IsOptional()
  @IsUUID()
  threadId?: string;
}
