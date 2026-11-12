import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

// Trims text, and turns '' into null so a field can be cleared
const clean = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : value,
  );

// Every field is optional: send only what changed
export class UpdateProfileDto {
  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(60)
  displayName?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(120)
  headline?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(1000)
  bio?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(80)
  location?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(80)
  company?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(80)
  jobTitle?: string | null;

  @IsOptional()
  @clean()
  @IsString()
  @MaxLength(30)
  pronouns?: string | null;

  @IsOptional()
  @IsBoolean()
  availableForWork?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  interests?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills?: string[];

  // Links are full urls, e.g. https://x.com/suraj
  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  website?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  twitter?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  github?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  linkedin?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  medium?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  youtube?: string | null;

  @IsOptional()
  @clean()
  @IsUrl()
  @MaxLength(200)
  instagram?: string | null;
}
