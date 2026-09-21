import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

async function getProjectWithMembership(userId, projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return { project: null, membership: null };

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.organizationId,
      },
    },
  });

  return { project, membership };
}

// List all tasks in a project
export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { projectId } = await params;
    const { project, membership } = await getProjectWithMembership(
      currentUser.userId,
      projectId
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    // Also send org members so we can build an "assign to" dropdown
    const members = await prisma.organizationMember.findMany({
      where: { organizationId: project.organizationId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(
      { tasks, project, myRole: membership.role, members },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Create a new task
export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { projectId } = await params;
    const { project, membership } = await getProjectWithMembership(
      currentUser.userId,
      projectId
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Only OWNER and ADMIN can create tasks
    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can create tasks" },
        { status: 403 }
      );
    }

    const { title, description, priority, assigneeId, dueDate } = await request.json();

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "MEDIUM",
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ message: "Task created", task }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}