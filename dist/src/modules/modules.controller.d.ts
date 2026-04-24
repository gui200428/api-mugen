import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    create(createModuleDto: CreateModuleDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        position: number;
    }>;
    findAll(): Promise<({
        lessons: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            position: number;
            videoUrl: string;
            moduleId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        position: number;
    })[]>;
    findOne(id: number): Promise<{
        lessons: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            position: number;
            videoUrl: string;
            moduleId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        position: number;
    }>;
    update(id: number, updateModuleDto: UpdateModuleDto): Promise<{
        lessons: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            position: number;
            videoUrl: string;
            moduleId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        position: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        position: number;
    }>;
}
