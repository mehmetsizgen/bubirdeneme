import { PrismaClient, Prisma } from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient(
    {
        // log: ['query', 'info', 'warn', 'error'],
    }
)

if(process.env.NODE_ENV !== "development") globalThis.prisma = client

export default client