import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

async function checkMembership(userId, orgId) {
  return prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: orgId,
      },
    },
  });
}

// List all projects in an organization
export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;

    const membership = await checkMembership(currentUser.userId, orgId);
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    return NextResponse.json(
      { projects, organization, myRole: membership.role },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Create a new project
export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;

    const membership = await checkMembership(currentUser.userId, orgId);
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Only OWNER or ADMIN can create projects
    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Only owners and admins can create projects" },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        organizationId: orgId,
      },
    });

    return NextResponse.json({ message: "Project created", project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}