import {
  Controller,
  Get,
  Put,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PortfolioService } from './portfolio.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyCredentialsDto } from './dto/verify-credentials.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// Multer Storage Configuration for PDF Credential Files
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomName = Array(16)
      .fill(null)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    cb(null, `cred_${randomName}${extname(file.originalname)}`);
  },
});

@ApiTags('Module 5.2 - Tutor Portfolio & Credentials Audit Engine')
@Controller('api/v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current tutor profile, credentials audit status, and availability matrix' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.portfolioService.getProfile(user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FR-PROF-04: Configure availability calendar, teaching modes, rate, and geographic radius' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.portfolioService.updateProfile(user.id, dto);
  }

  @Post('upload-credentials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TUTOR')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('credentialPdf', { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'FR-PROF-03: Upload PDF credentials/certifications (Tags document as PENDING_AUDIT)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        credentialPdf: {
          type: 'string',
          format: 'binary',
          description: 'Background credential or university degree document in PDF format (<10MB)',
        },
      },
    },
  })
  async uploadCredentials(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.portfolioService.uploadCredentials(user.id, file);
  }

  @Get('admin/pending-audits')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FR-PROF-03 Admin: Fetch list of tutor background credentials awaiting verification audit' })
  async getPendingAudits() {
    return this.portfolioService.getPendingAudits();
  }

  @Patch('admin/verify-credentials/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FR-PROF-03 Admin: Approve or Reject tutor background credential submission' })
  async verifyCredentials(@Param('id') profileId: string, @Body() dto: VerifyCredentialsDto) {
    return this.portfolioService.verifyCredentials(profileId, dto);
  }
}
