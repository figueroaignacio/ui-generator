import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateConversationDto) {
    return this.conversationsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.conversationsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.findOne(id, req.user.id);
  }

  @Post(':id/messages')
  addMessage(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.conversationsService.addMessage(id, req.user.id, dto);
  }

  @Post(':id/generate')
  generate(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.generateResponse(id, req.user.id);
  }

  @Post(':id/stream')
  async generateStream(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { model?: string },
    @Res() res: Response,
  ) {
    const result = await this.conversationsService.generateStreamResponse(
      id,
      req.user.id,
      body?.model,
    );
    return result.pipeTextStreamToResponse(res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.remove(id, req.user.id);
  }
}
