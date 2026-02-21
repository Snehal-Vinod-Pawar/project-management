"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.postUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
const postUser = async (req, res) => {
    try {
        const loggedInUser = req.user; // from auth middleware
        const { username, email, profilePictureUrl } = req.body;
        const finalProfilePictureUrl = profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=fff&size=256`;
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                profilePictureUrl: finalProfilePictureUrl,
                workspaceId: loggedInUser.workspaceId, // auto attach to same workspace
            },
        });
        res.json({ message: "User Created Successfully", newUser });
    }
    catch (error) {
        console.error("CREATE USER ERROR:", error);
        res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
};
exports.postUser = postUser;
const deleteUser = async (req, res) => {
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
exports.deleteUser = deleteUser;
