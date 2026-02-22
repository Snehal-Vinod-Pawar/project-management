"use strict";
// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";
// const prisma = new PrismaClient();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const ADMIN_EMAIL = "snehalpawar2005@gmail.com";
// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     return modelName.charAt(0).toUpperCase() + modelName.slice(1);
//   });
//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } catch (error) {
//       console.error(`Error clearing data from ${modelName}:`, error);
//     }
//   }
// }
// async function main() {
//   const dataDirectory = path.join(__dirname, "seedData");
//   const orderedFileNames = [
//     "team.json",
//     "project.json",
//     "projectTeam.json",
//     "user.json",
//     "task.json",
//     "attachment.json",
//     "comment.json",
//     "taskAssignment.json",
//   ];
//   await deleteAllData(orderedFileNames);
//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     const modelName = path.basename(fileName, path.extname(fileName));
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       for (const data of jsonData) {
//         await model.create({ data });
//       }
//       console.log(`Seeded ${modelName} with data from ${fileName}`);
//     } catch (error) {
//       console.error(`Error seeding data for ${modelName}:`, error);
//     }
//   }
// }
// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    const base = path_1.default.join(__dirname, "seedData");
    const users = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "user.json"), "utf-8"));
    const teams = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "team.json"), "utf-8"));
    const projects = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "project.json"), "utf-8"));
    const projectTeams = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "projectTeam.json"), "utf-8"));
    const tasks = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "task.json"), "utf-8"));
    const attachments = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "attachment.json"), "utf-8"));
    const comments = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "comment.json"), "utf-8"));
    const taskAssignments = JSON.parse(fs_1.default.readFileSync(path_1.default.join(base, "taskAssignment.json"), "utf-8"));
    console.log("1. Teams");
    await prisma.team.createMany({
        data: teams.map((t) => ({
            teamName: t.teamName,
            ownerId: t.productOwnerUserId
        }))
    });
    console.log("2. Users");
    await prisma.user.createMany({
        data: users.map((u) => ({
            username: u.username,
            email: u.email ?? null,
            password: u.password ?? null,
            profilePictureUrl: u.profilePictureUrl ?? null,
            teamId: u.teamId
        })),
        skipDuplicates: true
    });
    console.log("3. Projects");
    await prisma.project.createMany({
        data: projects.map((p) => ({
            name: p.name,
            description: p.description,
            startDate: new Date(p.startDate),
            endDate: new Date(p.endDate),
            ownerId: p.ownerId ?? null
        })),
        skipDuplicates: true
    });
    console.log("4. ProjectTeams");
    await prisma.projectTeam.createMany({ data: projectTeams ,skipDuplicates: true});
    console.log("5. Tasks");
    await prisma.task.createMany({
        data: tasks.map((t) => ({
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            tags: t.tags,
            startDate: new Date(t.startDate),
            dueDate: new Date(t.dueDate),
            projectId: t.projectId,
            authorUserId: t.authorUserId,
            assignedUserId: t.assignedUserId
        })),
        skipDuplicates: true
    });
    console.log("6. TaskAssignments");
    await prisma.taskAssignment.createMany({ data: taskAssignments, skipDuplicates: true });
    console.log("7. Attachments");
    // await prisma.attachment.createMany({ data: attachments ,skipDuplicates: true});
    await prisma.attachment.createMany({
        data: attachments.map((a) => ({
            fileURL: a.fileURL,
            fileName: a.fileName,
            taskId: a.taskId,
            uploadedById: a.uploadedById
        })),
        skipDuplicates: true
    });
    // await prisma.comment.createMany({ data: comments, skipDuplicates: true });
    await prisma.comment.createMany({
        data: comments.map((c) => ({
            text: c.text,
            taskId: c.taskId,
            userId: c.userId
        })),
        skipDuplicates: true
    });
    console.log("8. Comments");
    console.log("FULL DATABASE RESTORED");
}
main()
    .catch(console.error)
    .finally(async () => prisma.$disconnect());
//# sourceMappingURL=seed.js.map