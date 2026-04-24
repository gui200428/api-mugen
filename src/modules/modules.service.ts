import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto) {
    return this.prisma.module.create({
      data: createModuleDto,
    });
  }

  async findAll() {
    return this.prisma.module.findMany({
      orderBy: { position: 'asc' },
      include: {
        lessons: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findOne(id: number) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id); // Ensure exists

    return this.prisma.module.update({
      where: { id },
      data: updateModuleDto,
      include: {
        lessons: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure exists

    return this.prisma.module.delete({
      where: { id },
    });
  }
}
