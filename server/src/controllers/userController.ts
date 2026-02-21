import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        workspace: {
          include: {
            members: {
              select: {
                userId: true,
                username: true,
                email: true,
                profilePictureUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.workspace) {
      return res.json([]);
    }

    res.json(user.workspace.members);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const postUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user; // from auth middleware

    const { username, email, profilePictureUrl } = req.body;

    const finalProfilePictureUrl = profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=fff&size=256`

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        profilePictureUrl: finalProfilePictureUrl,
        workspaceId: loggedInUser.workspaceId, // auto attach to same workspace
      },
    });

    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any){
      console.error("CREATE USER ERROR:", error);
      res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // delete dependent data first
  await prisma.task.deleteMany({
    where: {
      OR: [
        { authorUserId: id },
        { assignedUserId: id },
      ],
    },
  });

  await prisma.user.delete({
    where: { userId: id },
  });

  res.json({ success: true });
};
