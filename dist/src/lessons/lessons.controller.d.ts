import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
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
    findAll(moduleId?: string): Promise<({
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
