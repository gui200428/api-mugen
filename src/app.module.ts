import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,   // 1 segundo
          limit: 3,    // máximo 3 requisições por segundo
        },
        {
          name: 'medium',
          ttl: 10000,  // 10 segundos
          limit: 20,   // máximo 20 requisições a cada 10 segundos
        },
        {
          name: 'long',
          ttl: 60000,  // 1 minuto
          limit: 100,  // máximo 100 requisições por minuto
        },
      ],
    }),
    AuthModule,
    PrismaModule,
    AdminAuthModule,
    ModulesModule,
    LessonsModule,
    UsersModule,
    MailModule,
    WebhooksModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
