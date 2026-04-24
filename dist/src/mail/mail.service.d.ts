import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private readonly resend;
    private readonly fromEmail;
    private readonly logger;
    constructor(configService: ConfigService);
    sendWelcomeEmail(to: string, name: string, password: string): Promise<void>;
}
