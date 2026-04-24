import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    // Verify module exists
    const module = await this.prisma.module.findUnique({
      where: { id: createLessonDto.moduleId },
    });

    if (!module) {
      throw new NotFoundException(
        `Module with ID ${createLessonDto.moduleId} not found`,
      );
    }

    return this.prisma.lesson.create({
      data: createLessonDto,
      include: { module: true },
    });
  }

  async findAll(moduleId?: number) {
    return this.prisma.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: { position: 'asc' },
      include: { module: true },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { module: true },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id); // Ensure exists

    // If changing module, verify it exists
    if (updateLessonDto.moduleId !== undefined) {
      const targetModule = await this.prisma.module.findUnique({
        where: { id: updateLessonDto.moduleId },
      });

      if (!targetModule) {
        throw new NotFoundException(
          `Module with ID ${updateLessonDto.moduleId} not found`,
        );
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: { module: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure exists

    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
