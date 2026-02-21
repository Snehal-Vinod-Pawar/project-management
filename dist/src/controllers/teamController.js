"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToTeam = exports.createTeam = exports.getTeams = void 0;
const prisma_1 = require("../lib/prisma");
const emailService_1 = require("../services/emailService");
const getTeams = async (req, res) => {
    const userId = req.user.userId;
    try {
        const teams = await prisma_1.prisma.team.findMany({
            where: { ownerId: userId },
            include: {
                members: true,
                owner: true,
            },
        });
        console.log(JSON.stringify(teams, null, 2));
        res.json(teams);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTeams = getTeams;
const createTeam = async (req, res) => {
    const { teamName } = req.body;
    const userId = req.user.userId;
    try {
        const team = await prisma_1.prisma.team.create({
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
        const user = await prisma_1.prisma.user.findUnique({
            where: { userId },
        });
        if (user === null || user === void 0 ? void 0 : user.email) {
            await (0, emailService_1.sendEmail)(user.email, "Team Created Successfully", `<h3>You created a new team</h3><p>Team name: <b>${team.teamName}</b></p>`);
        }
        res.status(201).json(team);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTeam = createTeam;
const addUserToTeam = async (req, res) => {
    const { teamId } = req.params;
    const { email } = req.body;
    const inviter = req.user;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma_1.prisma.team.update({
            where: { id: Number(teamId) },
            data: {
                members: {
                    connect: { userId: user.userId },
                },
            },
        });
        const team = await prisma_1.prisma.team.findUnique({
            where: { id: Number(teamId) },
        });
        // 📧 EMAIL (this is the feature you wanted)
        if (user.email && team) {
            await (0, emailService_1.sendEmail)(user.email, `Added to team ${team.teamName}`, `
          <h3>You were added to a team</h3>
          <p>
            <b>${inviter.username}</b> added you to
            <b>${team.teamName}</b>.
          </p>
        `);
        }
        res.json({ message: "User added to team" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addUserToTeam = addUserToTeam;
