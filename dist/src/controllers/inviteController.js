"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptProjectInvite = exports.inviteToProject = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const emailService_1 = require("../services/emailService");
const inviteToProject = async (req, res) => {
    const { email, projectId } = req.body;
    const inviter = req.user;
    if (!projectId) {
        return res.status(400).json({ message: "projectId is required" });
    }
    const token = crypto_1.default.randomBytes(32).toString("hex");
    await prisma_1.prisma.invite.create({
        data: {
            email,
            projectId,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });
    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;
    await (0, emailService_1.sendEmail)(email, "You’ve been invited to a project", `
      <h3>Project Invitation</h3>
      <p>${inviter.username} invited you to join a project.</p>
      <a href="${inviteLink}">Accept Invitation</a>
      <p>This link expires in 24 hours.</p>
    `);
    res.json({ success: true });
};
exports.inviteToProject = inviteToProject;
const acceptProjectInvite = async (req, res) => {
    const token = String(req.query.token);
    const user = req.user;
    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }
    const invite = await prisma_1.prisma.invite.findUnique({
        where: { token },
    });
    if (!invite || invite.used || invite.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invite invalid or expired" });
    }
    if (!invite.projectId) {
        return res.status(400).json({ message: "Invite is not for a project" });
    }
    // Check if already a member
    const existingMember = await prisma_1.prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: invite.projectId,
                userId: user.userId,
            },
        },
    });
    if (!existingMember) {
        await prisma_1.prisma.projectMember.create({
            data: {
                projectId: invite.projectId,
                userId: user.userId,
                role: invite.role,
            },
        });
    }
    await prisma_1.prisma.invite.update({
        where: { token },
        data: { used: true },
    });
    res.json({ success: true, projectId: invite.projectId });
};
exports.acceptProjectInvite = acceptProjectInvite;
