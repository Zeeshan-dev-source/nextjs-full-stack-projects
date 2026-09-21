import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

async function getMembership(userId, orgId) {
  return prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId: orgId },
    },
  });
}

// Update organization name
export async function PATCH(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;
    const membership = await getMembership(currentUser.userId, orgId);

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Only owners and admins can edit the organization" },
        { status: 403 }
      );
    }

    const { name } = await request.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: { name },
    });

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Delete organization (OWNER only)
export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;
    const membership = await getMembership(currentUser.userId, orgId);

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    if (membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only the owner can delete the organization" },
        { status: 403 }
      );
    }

    await prisma.organization.delete({
      where: { id: orgId },
    });

    return NextResponse.json({ message: "Organization deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}