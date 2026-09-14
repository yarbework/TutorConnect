import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentOrder, PaymentOrderStatus, PaymentProvider } from './entities/payment-order.entity';
import { Wallet } from '../jobs/entities/wallet.entity';
import { WalletTransaction, TransactionType, TransactionReason } from '../jobs/entities/wallet-transaction.entity';
import { PaymentGatewayAdapter } from './adapters/payment-gateway.interface';
import { MockGatewayAdapter } from './adapters/mock-gateway.adapter';
import { ChapaGatewayAdapter } from './adapters/chapa-gateway.adapter';
import { CONNECTS_PACKS_CATALOG, CreateCheckoutDto } from './dto/payment.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly adapter: PaymentGatewayAdapter;

  constructor(
    @InjectRepository(PaymentOrder)
    private readonly orderRepo: Repository<PaymentOrder>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly mockAdapter: MockGatewayAdapter,
    private readonly chapaAdapter: ChapaGatewayAdapter,
  ) {
    const provider = process.env.PAYMENT_GATEWAY_PROVIDER || 'MOCK';
    this.adapter = provider === 'CHAPA' ? this.chapaAdapter : this.mockAdapter;
    this.logger.log(`Initialized Payment Engine using [${this.adapter.providerName}] Adapter`);
  }


  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    const pack = CONNECTS_PACKS_CATALOG[dto.packageId];
    if (!pack) throw new BadRequestException('Invalid Connects Package');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const txRef = `TC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const order = this.orderRepo.create({
      txRef,
      userId,
      amountETB: pack.priceETB,
      connectsAmount: pack.connects,
      status: PaymentOrderStatus.PENDING,
      provider: this.adapter.providerName as PaymentProvider,
    });
    await this.orderRepo.save(order);

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001/api/v1';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await this.adapter.initialize({
      txRef,
      amountETB: pack.priceETB,
      connectsAmount: pack.connects,
      userEmail: user.email,
      callbackUrl: `${baseUrl}/payments/webhook`,
      returnUrl: `${frontendUrl}/wallet?payment=success&txRef=${txRef}`,
    });

    return {
      checkoutUrl: session.checkoutUrl,
      txRef,
      amountETB: pack.priceETB,
      connects: pack.connects,
    };
  }


  async getOrderByTxRef(txRef: string) {
    const order = await this.orderRepo.findOne({
      where: { txRef },
      relations: { user: true },
    });
    if (!order) throw new NotFoundException(`Order with reference '${txRef}' not found`);
    return order;
  }


  async processWebhook(signature: string, rawBody: string | Buffer, body: any) {
    const isValid = this.adapter.verifyWebhookSignature(signature, rawBody);
    if (!isValid) {
      this.logger.warn(`Rejected unauthorized payment webhook. Invalid HMAC signature.`);
      throw new UnauthorizedException('Invalid payment signature');
    }

    const payload = this.adapter.parseWebhookPayload(body);
    this.logger.log(`Processing verified payment webhook for txRef: ${payload.txRef}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(PaymentOrder, {
        where: { txRef: payload.txRef },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException(`Order ${payload.txRef} not found in database`);
      }

      if (order.status === PaymentOrderStatus.SUCCESS) {
        this.logger.log(`Order ${payload.txRef} was already processed. Ignoring duplicate webhook.`);
        await queryRunner.commitTransaction();
        return { status: 'ALREADY_PROCESSED' };
      }

      if (payload.status !== 'SUCCESS') {
        order.status = PaymentOrderStatus.FAILED;
        order.rawGatewayResponse = payload.raw;
        await queryRunner.manager.save(order);
        await queryRunner.commitTransaction();
        return { status: 'FAILED' };
      }

      order.status = PaymentOrderStatus.SUCCESS;
      order.gatewayReference = payload.gatewayReference;
      order.rawGatewayResponse = payload.raw;
      await queryRunner.manager.save(order);

      let wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId: order.userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        wallet = queryRunner.manager.create(Wallet, {
          userId: order.userId,
          balance: 10,
        });
        await queryRunner.manager.save(wallet);
      }

      wallet.balance += order.connectsAmount;
      await queryRunner.manager.save(wallet);

      const ledgerEntry = queryRunner.manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount: order.connectsAmount,
        type: TransactionType.CREDIT,
        reason: TransactionReason.CONNECTS_PURCHASE,
        referenceId: order.txRef,
        description: `Purchased ${order.connectsAmount} Connects via ${order.provider} (${order.amountETB} ETB)`,
      });
      await queryRunner.manager.save(ledgerEntry);

      await queryRunner.commitTransaction();
      this.logger.log(`Successfully credited ${order.connectsAmount} Connects to User ${order.userId}`);

      return { status: 'SUCCESS', credited: order.connectsAmount };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async simulateFrontendCallback(txRef: string, outcome: 'SUCCESS' | 'FAILED') {
    const payload = {
      txRef,
      status: outcome,
      reference: `MOCK-TXN-${Date.now()}`,
      amount: 320,
    };
    const payloadStr = JSON.stringify(payload);
    const signature = this.mockAdapter.generateTestSignature(payloadStr);

    return this.processWebhook(signature, payloadStr, payload);
  }
}