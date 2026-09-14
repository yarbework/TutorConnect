import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  PaymentGatewayAdapter,
  InitializePaymentParams,
  InitializePaymentResult,
  WebhookPayload,
} from './payment-gateway.interface';

@Injectable()
export class ChapaGatewayAdapter implements PaymentGatewayAdapter {
  readonly providerName = 'CHAPA';
  private readonly secretKey = process.env.CHAPA_SECRET_KEY || '';

  async initialize(params: InitializePaymentParams): Promise<InitializePaymentResult> {
    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amountETB.toString(),
        currency: 'ETB',
        email: params.userEmail,
        tx_ref: params.txRef,
        callback_url: params.callbackUrl,
        return_url: params.returnUrl,
        customization: {
          title: 'TutorConnect Credits',
          description: `Purchase of ${params.connectsAmount} Connects`,
        },
      }),
    });

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(`Chapa initialization failed: ${data.message || 'Unknown error'}`);
    }

    return {
      checkoutUrl: data.data.checkout_url,
      txRef: params.txRef,
    };
  }

  verifyWebhookSignature(signature: string, rawBody: string | Buffer): boolean {
    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
    const expected = crypto.createHmac('sha256', this.secretKey).update(bodyString).digest('hex');
    return signature === expected;
  }

  parseWebhookPayload(body: any): WebhookPayload {
    return {
      txRef: body.tx_ref,
      status: body.status === 'success' ? 'SUCCESS' : 'FAILED',
      gatewayReference: body.reference,
      amount: Number(body.amount),
      raw: body,
    };
  }
}