import { PrismaClient } from "@/generated/prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaTiDBCloud({ url: connectionString }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;