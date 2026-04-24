import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
