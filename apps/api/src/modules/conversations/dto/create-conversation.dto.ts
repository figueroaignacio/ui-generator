import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
