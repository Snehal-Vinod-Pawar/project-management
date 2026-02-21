import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../services/emailService";

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;// from auth middleware

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },     // ProjectMember
          { projectTeams: { some: { team: { members: { some: { userId } } } } } } // Team
        ]
      },
      include: {
        members: { include: { user: true } },
        projectTeams: { include: { team: true } }
      }
    });

    res.json(projects); // ✅ OUTSIDE prisma call
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, description, startDate, endDate, status: projectStatus } = req.body;
  const userId = (req.user as any).userId;

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        status: projectStatus || "Active",
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "Owner",
          },
        },
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating a project: ${error.message}` });
  }
};


export const inviteUserToProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    // 1. Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if already a member
    const existingMember = await prisma.projectMember?.findUnique({
      where: {
        projectId_userId: {
          projectId: Number(projectId),
          userId: invitedUser.userId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: "User already in project" });
    }

    // 3. Add as project member
    const member = await prisma.projectMember?.create({
      data: {
        projectId: Number(projectId),
        userId: invitedUser.userId,
        role: "Member",
      },
    });

    // Also add to team of that project (if any)
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: { projectTeams: true },
    });

    if (project && project.projectTeams.length > 0) {
      const teamId = project.projectTeams[0]!.teamId; // non-null assertion

      await prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            connect: { userId: invitedUser.userId },
          },
        },
      });
    }

    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const id = Number(projectId);

    // 1. Delete project members
    await prisma.projectMember.deleteMany({
      where: { projectId: id },
    });

    // 2. Delete project-team links
    await prisma.projectTeam.deleteMany({
      where: { projectId: id },
    });

    // 3. Ensure no tasks remain (safety)
    const taskCount = await prisma.task.count({
      where: { projectId: id },
    });

    if (taskCount > 0) {
      return res.status(400).json({
        message: "Delete tasks before deleting the project.",
      });
    }

    // 4. Finally delete project
    await prisma.project.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const renameProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name } = req.body;

  try {
    const updated = await prisma.project.update({
      where: { id: Number(projectId) },
      data: { name },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const assignProjectToTeam = async (req: Request, res: Response) => {
  const { projectId, teamId } = req.body;

  if (!projectId || !teamId) {
    return res.status(400).json({ message: "projectId and teamId required" });
  }

  try {
    // ensure project exists
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ensure team exists
    const team = await prisma.team.findUnique({
      where: { id: Number(teamId) },
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // avoid duplicate
    const exists = await prisma.projectTeam.findFirst({
      where: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    if (exists) {
      return res.json({ message: "Already assigned" });
    }

    await prisma.projectTeam.create({
      data: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};