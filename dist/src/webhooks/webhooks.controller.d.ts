import { ConfigService } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    private readonly configService;
    private readonly logger;
    constructor(webhooksService: WebhooksService, configService: ConfigService);
    handleHotmart(payload: any, hottok: string): Promise<{
        received: boolean;
    }>;
}
