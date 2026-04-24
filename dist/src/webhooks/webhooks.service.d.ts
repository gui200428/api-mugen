import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class WebhooksService {
    private prisma;
    private mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    handlePurchaseApproved(data: any): Promise<void>;
    handlePurchaseRefunded(data: any): Promise<void>;
    handlePurchaseCanceled(data: any): Promise<void>;
}
