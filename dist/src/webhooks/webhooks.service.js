"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let WebhooksService = WebhooksService_1 = class WebhooksService {
    prisma;
    mailService;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async handlePurchaseApproved(data) {
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
        const existingSale = await this.prisma.sale.findUnique({
            where: { transaction },
        });
        if (existingSale) {
            this.logger.warn(`Transaction ${transaction} already processed. Skipping.`);
            return;
        }
        let user = await this.prisma.user.findUnique({
            where: { email: buyerEmail },
        });
        let generatedPassword = null;
        if (!user) {
            generatedPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            user = await this.prisma.user.create({
                data: {
                    name: buyerName,
                    email: buyerEmail,
                    password: hashedPassword,
                },
            });
            this.logger.log(`User created: ${buyerEmail} (id: ${user.id})`);
        }
        else {
            this.logger.log(`User already exists: ${buyerEmail} (id: ${user.id})`);
        }
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
        if (generatedPassword) {
            await this.mailService.sendWelcomeEmail(buyerEmail, buyerName, generatedPassword);
        }
    }
    async handlePurchaseRefunded(data) {
        const transaction = data?.purchase?.transaction;
        if (!transaction)
            return;
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
    async handlePurchaseCanceled(data) {
        const transaction = data?.purchase?.transaction;
        if (!transaction)
            return;
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
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map