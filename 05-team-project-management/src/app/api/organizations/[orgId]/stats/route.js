import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;

    const membership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: currentUser.userId, organizationId: orgId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    const [totalProjects, totalMembers, tasksByStatus, allTasks] = await Promise.all([
      prisma.project.count({ where: { organizationId: orgId } }),
      prisma.organizationMember.count({ where: { organizationId: orgId } }),
      prisma.task.groupBy({
        by: ["status"],
        where: { project: { organizationId: orgId } },
        _count: true,
      }),
      prisma.task.findMany({
        where: { project: { organizationId: orgId } },
        select: { id: true, dueDate: true, status: true },
      }),
    ]);

    const statusCounts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    tasksByStatus.forEach((row) => {
      statusCounts[row.status] = row._count;
    });

    const totalTasks = allTasks.length;
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((statusCounts.DONE / totalTasks) * 100);

    const now = new Date();
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE"
    ).length;

    // Per-project breakdown
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      include: {
        tasks: { select: { status: true } },
      },
    });

    const projectStats = projects.map((p) => {
      const total = p.tasks.length;
      const done = p.tasks.filter((t) => t.status === "DONE").length;
      return {
        id: p.id,
        name: p.name,
        totalTasks: total,
        doneTasks: done,
        completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
      };
    });

    return NextResponse.json(
      {
        totalProjects,
        totalMembers,
        totalTasks,
        statusCounts,
        completionRate,
        overdueTasks,
        projectStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}