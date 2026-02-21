import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../services/emailService";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.userId;

  try {
    const teams = await prisma.team.findMany({
      where: { ownerId: userId },
      include: {
        members: true,
        owner:true,
      },
    });

    console.log(JSON.stringify(teams, null, 2));

    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createTeam = async (req: Request, res: Response) => {
  const { teamName } = req.body;
  const userId = (req as any).user.userId;

  try {
    const team = await prisma.team.create({
      data: {
        teamName,
        ownerId: userId,
        members: {
          connect: { userId }
        }
      },
      include: {
        members: true,
      },
    });

    //EMAIL NOTIFICATION
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (user?.email) {
      await sendEmail(
        user.email,
        "Team Created Successfully",
        `<h3>You created a new team</h3><p>Team name: <b>${team.teamName}</b></p>`
      );
    }

    res.status(201).json(team);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserToTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { email } = req.body;
  const inviter = (req as any).user;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.team.update({
      where: { id: Number(teamId) },
      data: {
        members: {
          connect: { userId: user.userId },
        },
      },
    });

    const team = await prisma.team.findUnique({
      where: { id: Number(teamId) },
    });

    // 📧 EMAIL (this is the feature you wanted)
    if (user.email && team) {
      await sendEmail(
        user.email,
        `Added to team ${team.teamName}`,
        `
          <h3>You were added to a team</h3>
          <p>
            <b>${inviter.username}</b> added you to
            <b>${team.teamName}</b>.
          </p>
        `
      );
    }

    res.json({ message: "User added to team" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
