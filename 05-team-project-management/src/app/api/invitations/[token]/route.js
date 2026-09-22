import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

// Get invitation details (to show on the invite page before accepting)
export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    const { token } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
        invitedBy: { select: { name: true, email: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "This invitation is no longer valid" }, { status: 410 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation has expired" }, { status: 410 });
    }

    let isAlreadyMember = false;
    if (currentUser) {
      const membership = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: currentUser.userId,
            organizationId: invitation.organizationId,
          },
        },
      });
      if (membership) isAlreadyMember = true;
    }

    return NextResponse.json(
      {
        invitation,
        currentUser: currentUser ? { email: currentUser.email, userId: currentUser.userId } : null,
        isAlreadyMember,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Accept the invitation (link-based with authenticated user)
export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { token } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "This invitation is no longer valid" }, { status: 410 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation has expired" }, { status: 410 });
    }

    // If user is already a member, return success so they can navigate to the organization
    const existingMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: currentUser.userId,
          organizationId: invitation.organizationId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "You are already a member of this organization", organizationId: invitation.organizationId },
        { status: 200 }
      );
    }

    // Add user as member + mark invitation accepted
    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          userId: currentUser.userId,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      }),
      prisma.invitation.update({
        where: { token },
        data: { status: "ACCEPTED" },
      }),
    ]);

    return NextResponse.json(
      { message: "Joined organization", organizationId: invitation.organizationId },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}