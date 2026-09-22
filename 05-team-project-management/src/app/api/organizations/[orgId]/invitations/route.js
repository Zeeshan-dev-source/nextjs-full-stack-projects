import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

const prisma = new PrismaClient();

// List pending invitations for an organization
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

    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Only owners and admins can view invitations" },
        { status: 403 }
      );
    }

    const invitations = await prisma.invitation.findMany({
      where: { organizationId: orgId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Create a new invitation
export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { orgId } = await params;

    const membership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: currentUser.userId, organizationId: orgId } },
    });

    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Only owners and admins can invite members" },
        { status: 403 }
      );
    }

    const { email, role } = await request.json();

    if (!email || email.trim() === "") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "MEMBER", "VIEWER"];
    const inviteRole = validRoles.includes(role) ? role : "MEMBER";

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const alreadyMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: { userId: existingUser.id, organizationId: orgId },
        },
      });
      if (alreadyMember) {
        return NextResponse.json(
          { error: "This user is already a member" },
          { status: 409 }
        );
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role: inviteRole,
        token,
        expiresAt,
        organizationId: orgId,
        invitedById: currentUser.userId,
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`;

    return NextResponse.json(
      { message: "Invitation created", invitation, inviteLink },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}