import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class InvokeGraphDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000)
  message: string;

  // Comes from POST /graph/threads; the service checks it belongs to the user
  @IsString()
  @IsNotEmpty()
  threadId: string;
}
