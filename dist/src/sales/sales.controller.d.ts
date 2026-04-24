import { PrismaService } from '../prisma/prisma.service';
export declare class SalesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        transaction: string;
        buyerEmail: string;
        buyerName: string;
        productId: string;
        productName: string;
        status: string;
        hotmartPayload: import("@prisma/client/runtime/client").JsonValue;
        userId: number | null;
    })[]>;
}
