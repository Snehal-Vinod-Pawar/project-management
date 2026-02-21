"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = async (req, res) => {
    const { query } = req.query;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userEmail = req.user.email; // use email instead of userId
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
                            { title: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
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
                            { name: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                        ],
                    },
                ],
            },
        });
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { email: { not: userEmail } },
                    { username: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        res.json({ tasks, projects, users });
    }
    catch (error) {
        res.status(500).json({
            message: `Error performing search: ${error.message}`,
        });
    }
};
exports.search = search;
