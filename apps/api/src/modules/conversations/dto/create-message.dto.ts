import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageRole } from '../entities/message.entity';

export class CreateMessageDto {
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  parts?: any[];
}
