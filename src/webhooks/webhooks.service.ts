import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async handlePurchaseApproved(data: any) {
    const buyerEmail = data?.buyer?.email;
    const buyerName = data?.buyer?.name || 'Aluno';
    const transaction = data?.purchase?.transaction;
    const productId = String(data?.product?.id || '');
    const productName = data?.product?.name || 'Produto';

    if (!buyerEmail || !transaction) {
      this.logger.warn('PURCHASE_APPROVED: Missing buyer email or transaction');
      return;
    }

    this.logger.log(`Processing PURCHASE_APPROVED for ${buyerEmail} (tx: ${transaction})`);

    // Check if this transaction was already processed (idempotency)
    const existingSale = await this.prisma.sale.findUnique({
      where: { transaction },
    });

    if (existingSale) {
      this.logger.warn(`Transaction ${transaction} already processed. Skipping.`);
      return;
    }

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: buyerEmail },
    });

    let generatedPassword: string | null = null;

    if (!user) {
      // Generate a random password
      generatedPassword = crypto.randomBytes(8).toString('hex'); // 16 chars
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = await this.prisma.user.create({
        data: {
          name: buyerName,
          email: buyerEmail,
          password: hashedPassword,
        },
      });

      this.logger.log(`User created: ${buyerEmail} (id: ${user.id})`);
    } else {
      this.logger.log(`User already exists: ${buyerEmail} (id: ${user.id})`);
    }

    // Register the sale
    await this.prisma.sale.create({
      data: {
        transaction,
        buyerEmail,
        buyerName,
        productId,
        productName,
        status: 'APPROVED',
        hotmartPayload: data,
        userId: user.id,
      },
    });

    this.logger.log(`Sale registered: ${transaction}`);

    // Send welcome email only for new users
    if (generatedPassword) {
      await this.mailService.sendWelcomeEmail(buyerEmail, buyerName, generatedPassword);
    }
  }

  async handlePurchaseRefunded(data: any) {
    const transaction = data?.purchase?.transaction;
    if (!transaction) return;

    this.logger.log(`Processing PURCHASE_REFUNDED for tx: ${transaction}`);

    const sale = await this.prisma.sale.findUnique({ where: { transaction } });
    if (!sale) {
      this.logger.warn(`Sale not found for transaction: ${transaction}`);
      return;
    }

    await this.prisma.sale.update({
      where: { transaction },
      data: { status: 'REFUNDED', hotmartPayload: data },
    });

    this.logger.log(`Sale ${transaction} marked as REFUNDED`);
  }

  async handlePurchaseCanceled(data: any) {
    const transaction = data?.purchase?.transaction;
    if (!transaction) return;

    this.logger.log(`Processing PURCHASE_CANCELED for tx: ${transaction}`);

    const sale = await this.prisma.sale.findUnique({ where: { transaction } });
    if (!sale) {
      this.logger.warn(`Sale not found for transaction: ${transaction}`);
      return;
    }

    await this.prisma.sale.update({
      where: { transaction },
      data: { status: 'CANCELED', hotmartPayload: data },
    });

    this.logger.log(`Sale ${transaction} marked as CANCELED`);
  }
}
