import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: currentUser.userId },
      select: { organizationId: true },
    });

    const orgIds = memberships.map((m) => m.organizationId);

    const projects = await prisma.project.findMany({
      where: { organizationId: { in: orgIds } },
      include: {
        organization: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}