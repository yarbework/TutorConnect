import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Query,
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

  @Get()
  async browseTutors(
    @Query('subject') subject?: string,
    @Query('city') city?: string,
    @Query('maxRate') maxRate?: string,
    @Query('deliveryMode') deliveryMode?: string,
    @Query('gender') gender?: string,
  ) {
    return this.tutorService.searchTutors({
      subject,
      city,
      maxRate: maxRate ? parseFloat(maxRate) : undefined,
      deliveryMode,
      gender,
    });
  }
  
  @Get('featured')
  async getFeaturedTutors() {
    return this.tutorService.getFeaturedTutors(4);
  }

  @Get('profile/:id')
  async getPublicProfile(@Param('id', ParseUUIDPipe) profileId: string) {
    return this.tutorService.getPublicProfile(profileId);
  }

  @Get('stats/public')
  async getPublicStats() {
    return this.tutorService.getPublicPlatformStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR) 
  @Get('profile/me')
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.tutorService.getOrCreateProfile(userId);
  } 

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTutorProfileDto,
  ) {
    return this.tutorService.updateProfile(userId, dto);
  }


}