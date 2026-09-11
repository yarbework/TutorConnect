import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EngagementsService } from './engagements.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CloseEngagementDto } from './dto/close-engagement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/engagements')
@UseGuards(JwtAuthGuard)
export class EngagementsController {
  constructor(private readonly engagementsService: EngagementsService) {}

  @Get()
  async getMyEngagements(@Req() req: any) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.engagementsService.getUserEngagements(userId);
  }

  @Get(':id')
  async getEngagement(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.engagementsService.getEngagementById(id, userId);
  }

  @Get(':id/messages')
  async getMessages(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.engagementsService.getMessages(id, userId);
  }

  @Post(':id/messages')
  async sendMessage(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendMessageDto,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.engagementsService.sendMessage(id, userId, dto);
  }

  @Patch(':id/close')
  async closeEngagement(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseEngagementDto,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.engagementsService.closeEngagement(id, userId, dto);
  }
}