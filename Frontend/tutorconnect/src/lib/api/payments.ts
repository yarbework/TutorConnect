import { apiClient } from './client';

export interface CheckoutResult {
  checkoutUrl: string;
  txRef: string;
  amountETB: number;
  connects: number;
}

export interface OrderDetails {
  id: string;
  txRef: string;
  amountETB: number;
  connectsAmount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  provider: string;
  createdAt: string;
  user?: {
    email: string;
  };
}

export const paymentsApi = {
  createCheckout: (packageId: string) =>
    apiClient<CheckoutResult>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ packageId }),
    }),

  getOrderByTxRef: (txRef: string) =>
    apiClient<OrderDetails>(`/payments/order/${txRef}`, {
      method: 'GET',
    }),

  simulatePayment: (txRef: string, outcome: 'SUCCESS' | 'FAILED') =>
    apiClient<{ status: string }>('/payments/simulate', {
      method: 'POST',
      body: JSON.stringify({ txRef, outcome }),
    }),
};