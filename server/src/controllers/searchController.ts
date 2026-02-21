import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userEmail = (req as any).user.email;// use email instead of userId

  try {
    const tasks = await prisma.task.findMany({
      where: {
        AND: [
          {
            OR: [
              { author: { email: userEmail } },
              { assignee: { email: userEmail } },
            ],
          },
          {
            OR: [
              { title: { contains: query as string, mode: "insensitive" } },
              { description: { contains: query as string, mode: "insensitive" } },
            ],
          },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            tasks: {
              some: {
                OR: [
                  { author: { email: userEmail } },
                  { assignee: { email: userEmail } },
                ],
              },
            },
          },
          {
            OR: [
              { name: { contains: query as string, mode: "insensitive" } },
              { description: { contains: query as string, mode: "insensitive" } },
            ],
          },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { email: { not: userEmail } },
          { username: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    res.json({ tasks, projects, users });
  } catch (error: any) {
    res.status(500).json({
      message: `Error performing search: ${error.message}`,
    });
  }
};


