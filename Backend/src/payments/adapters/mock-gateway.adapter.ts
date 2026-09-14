import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  PaymentGatewayAdapter,
  InitializePaymentParams,
  InitializePaymentResult,
  WebhookPayload,
} from './payment-gateway.interface';

@Injectable()
export class MockGatewayAdapter implements PaymentGatewayAdapter {
  readonly providerName = 'MOCK';
  private readonly secretKey = process.env.PAYMENT_WEBHOOK_SECRET || 'tutorconnect_mock_secret_key_2026';

  async initialize(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const checkoutUrl = `${frontendUrl}/checkout/simulate/${params.txRef}`;

    return {
      checkoutUrl,
      txRef: params.txRef,
    };
  }

  verifyWebhookSignature(signature: string, rawBody: string | Buffer): boolean {
    if (!signature) return false;
    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(bodyString)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  parseWebhookPayload(body: any): WebhookPayload {
    return {
      txRef: body.txRef || body.tx_ref,
      status: body.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
      gatewayReference: body.reference || `MOCK-REF-${Date.now()}`,
      amount: Number(body.amount),
      raw: body,
    };
  }

  generateTestSignature(payloadString: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(payloadString)
      .digest('hex');
  }
}