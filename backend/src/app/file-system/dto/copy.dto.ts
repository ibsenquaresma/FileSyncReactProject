import { IsArray, IsEnum, IsString, IsBoolean } from 'class-validator';

export class CopyDto {
  @IsArray()
  files: string[];

  @IsEnum(['A', 'B'])
  from: 'A' | 'B';

  @IsEnum(['A', 'B'])
  to: 'A' | 'B';

  @IsBoolean()
  includeSubfolders: boolean;
}
