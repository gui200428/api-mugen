import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { WebhooksService } from './webhooks.service';

@SkipThrottle()
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  @Post('hotmart')
  @HttpCode(HttpStatus.OK)
  async handleHotmart(
    @Body() payload: any,
    @Headers('x-hotmart-hottok') hottok: string,
  ) {
    // Validate hottok
    const expectedHottok = this.configService.get<string>('HOTMART_HOTTOK');
    if (!expectedHottok || hottok !== expectedHottok) {
      this.logger.warn(`Invalid hottok received: ${hottok?.substring(0, 10)}...`);
      throw new UnauthorizedException('Invalid hottok');
    }

    const event = payload?.event;
    this.logger.log(`Hotmart webhook received: ${event}`);

    switch (event) {
      case 'PURCHASE_APPROVED':
        await this.webhooksService.handlePurchaseApproved(payload?.data);
        break;
      case 'PURCHASE_REFUNDED':
        await this.webhooksService.handlePurchaseRefunded(payload?.data);
        break;
      case 'PURCHASE_CANCELED':
        await this.webhooksService.handlePurchaseCanceled(payload?.data);
        break;
      case 'PURCHASE_PROTEST':
        await this.webhooksService.handlePurchaseRefunded(payload?.data);
        break;
      case 'PURCHASE_CHARGEBACK':
        await this.webhooksService.handlePurchaseRefunded(payload?.data);
        break;
      default:
        this.logger.log(`Unhandled event: ${event}. Ignoring.`);
    }

    return { received: true };
  }
}
