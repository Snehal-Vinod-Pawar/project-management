import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../services/emailService";

export const inviteToProject = async (req: Request, res: Response) => {
    const { email, projectId } = req.body;
    const inviter = (req as any).user;

    if (!projectId) {
        return res.status(400).json({ message: "projectId is required" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.invite.create({
        data: {
            email,
            projectId,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

    await sendEmail(
        email,
        "You’ve been invited to a project",
        `
      <h3>Project Invitation</h3>
      <p>${inviter.username} invited you to join a project.</p>
      <a href="${inviteLink}">Accept Invitation</a>
      <p>This link expires in 24 hours.</p>
    `
    );

    res.json({ success: true });
};

export const acceptProjectInvite = async (req: Request, res: Response) => {
    const token = String(req.query.token);
    const user = (req as any).user;
    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    const invite = await prisma.invite.findUnique({
        where: { token },
    });

    if (!invite || invite.used || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invite invalid or expired" });
    }

    if (!invite.projectId) {
        return res.status(400).json({ message: "Invite is not for a project" });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: invite.projectId,
                userId: user.userId,
            },
        },
    });

    if (!existingMember) {
        await prisma.projectMember.create({
            data: {
                projectId: invite.projectId,
                userId: user.userId,
                role: invite.role,
            },
        });
    }

    await prisma.invite.update({
        where: { token },
        data: { used: true },
    });

    res.json({ success: true, projectId: invite.projectId });
};
