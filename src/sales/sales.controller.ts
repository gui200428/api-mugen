import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../admin-auth/guards/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    const sales = await this.prisma.sale.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return sales;
  }
}
