"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const webhooks_service_1 = require("./webhooks.service");
let WebhooksController = WebhooksController_1 = class WebhooksController {
    webhooksService;
    configService;
    logger = new common_1.Logger(WebhooksController_1.name);
    constructor(webhooksService, configService) {
        this.webhooksService = webhooksService;
        this.configService = configService;
    }
    async handleHotmart(payload, hottok) {
        const expectedHottok = this.configService.get('HOTMART_HOTTOK');
        if (!expectedHottok || hottok !== expectedHottok) {
            this.logger.warn(`Invalid hottok received: ${hottok?.substring(0, 10)}...`);
            throw new common_1.UnauthorizedException('Invalid hottok');
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
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('hotmart'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hotmart-hottok')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleHotmart", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, throttler_1.SkipThrottle)({ default: true, short: true, medium: true, long: true }),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService,
        config_1.ConfigService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map