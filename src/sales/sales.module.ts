import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [SalesController],
})
export class SalesModule {}
