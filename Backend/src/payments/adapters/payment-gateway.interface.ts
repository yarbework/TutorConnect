export interface InitializePaymentParams {
  txRef: string;
  amountETB: number;
  connectsAmount: number;
  userEmail: string;
  userName?: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface InitializePaymentResult {
  checkoutUrl: string;
  txRef: string;
}

export interface WebhookPayload {
  txRef: string;
  status: 'SUCCESS' | 'FAILED';
  gatewayReference: string;
  amount: number;
  raw: Record<string, any>;
}

export interface PaymentGatewayAdapter {
  readonly providerName: string;
  initialize(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyWebhookSignature(signature: string, rawBody: string | Buffer): boolean;
  parseWebhookPayload(body: any): WebhookPayload;
}