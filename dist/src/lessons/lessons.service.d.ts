import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLessonDto: CreateLessonDto): Promise<{
        module: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        videoUrl: string;
        moduleId: number;
    }>;
    findAll(moduleId?: number): Promise<({
        module: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        videoUrl: string;
        moduleId: number;
    })[]>;
    findOne(id: number): Promise<{
        module: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        videoUrl: string;
        moduleId: number;
    }>;
    update(id: number, updateLessonDto: UpdateLessonDto): Promise<{
        module: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        videoUrl: string;
        moduleId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        position: number;
        videoUrl: string;
        moduleId: number;
    }>;
}
