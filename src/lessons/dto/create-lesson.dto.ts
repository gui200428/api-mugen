import { IsNotEmpty, IsOptional, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  videoUrl: string;

  @IsNotEmpty()
  @IsInt()
  moduleId: number;

  @IsOptional()
  @IsInt()
  position?: number;
}
