import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
  
import type { RawBodyRequest} from '@nestjs/common'
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: any, @Body() dto: CreateCheckoutDto) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.paymentsService.createCheckout(userId, dto);
  }


  @Get('order/:txRef')
  async getOrder(@Param('txRef') txRef: string) {
    return this.paymentsService.getOrderByTxRef(txRef);
  }


  @Post('webhook')
  async handleWebhook(
    @Headers('x-chapa-signature') chapaSig: string,
    @Headers('x-mock-signature') mockSig: string,
    @Body() body: any,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const signature = chapaSig || mockSig;
    const rawBody = req.rawBody || JSON.stringify(body);
    return this.paymentsService.processWebhook(signature, rawBody, body);
  }

 
  @Post('simulate')
  async simulateCallback(@Body() body: { txRef: string; outcome: 'SUCCESS' | 'FAILED' }) {
    return this.paymentsService.simulateFrontendCallback(body.txRef, body.outcome);
  }
}