import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('api/v1/tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Get('profile/me')
  async getMyProfile(@CurrentUser('sub') userId: string) {
    return this.tutorService.getOrCreateProfile(userId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Put('profile')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateTutorProfileDto,
  ) {
    return this.tutorService.updateProfile(userId, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getPublicProfile(@Param('id', ParseUUIDPipe) profileId: string) {
    return this.tutorService.getPublicProfile(profileId);
  }
}