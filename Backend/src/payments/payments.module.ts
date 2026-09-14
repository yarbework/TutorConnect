import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrder } from './entities/payment-order.entity';
import { User } from '../auth/entities/user.entity';
import { Wallet } from '../jobs/entities/wallet.entity';
import { WalletTransaction } from '../jobs/entities/wallet-transaction.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MockGatewayAdapter } from './adapters/mock-gateway.adapter';
import { ChapaGatewayAdapter } from './adapters/chapa-gateway.adapter';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentOrder,
      User,
      Wallet,
      WalletTransaction,
    ]),
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    MockGatewayAdapter,
    ChapaGatewayAdapter,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}