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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    configService;
    resend;
    fromEmail;
    logger = new common_1.Logger(MailService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
        this.fromEmail = this.configService.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
    }
    async sendWelcomeEmail(to, name, password) {
        const firstName = name.split(' ')[0];
        const loginUrl = this.configService.get('CORS_ORIGIN') || 'http://localhost:3001';
        try {
            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to,
                subject: '🎉 Seu acesso à plataforma está liberado!',
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#12121e;border-radius:16px;border:1px solid rgba(139,92,246,0.2);overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">Bem-vindo(a) à plataforma!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">Seu acesso já está liberado 🚀</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Olá <strong>${firstName}</strong>,<br><br>
        Sua compra foi confirmada! Aqui estão suas credenciais de acesso:
      </p>

      <!-- Credentials Box -->
      <div style="background:#1a1a2e;border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:24px;margin-bottom:24px;">
        <div style="margin-bottom:16px;">
          <span style="display:block;color:#a78bfa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">E-mail</span>
          <span style="display:block;color:#f1f5f9;font-size:16px;font-weight:500;">${to}</span>
        </div>
        <div>
          <span style="display:block;color:#a78bfa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Senha</span>
          <span style="display:block;color:#f1f5f9;font-size:16px;font-weight:500;font-family:monospace;background:#0f0f1a;padding:8px 12px;border-radius:8px;">${password}</span>
        </div>
      </div>

      <p style="color:#94a3b8;font-size:14px;line-height:1.5;margin:0 0 24px;">
        Recomendamos que altere sua senha após o primeiro login.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0 8px;">
        <a href="${loginUrl}/login" style="display:inline-block;background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);color:#fff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:16px;font-weight:600;">
          Acessar Plataforma
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid rgba(139,92,246,0.15);text-align:center;">
      <p style="color:#64748b;font-size:12px;margin:0;">
        Este e-mail foi enviado automaticamente. Não responda a esta mensagem.
      </p>
    </div>
  </div>
</body>
</html>
        `,
            });
            if (error) {
                this.logger.error(`Failed to send welcome email to ${to}`, error);
                return;
            }
            this.logger.log(`Welcome email sent to ${to} (id: ${data?.id})`);
        }
        catch (err) {
            this.logger.error(`Exception sending welcome email to ${to}`, err);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map