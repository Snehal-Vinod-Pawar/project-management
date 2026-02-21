// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   const admin = await prisma.user.findUnique({
//     where: { email: "snehal@gmail.com" } // put your seeded user's email
//   });

//   if (!admin) throw new Error("Admin user not found");

//   await prisma.project.updateMany({
//     data: { ownerId: admin.userId }
//   });

//   await prisma.task.updateMany({
//     data: { ownerId: admin.userId }
//   });

//   console.log("All projects & tasks assigned to admin");
// }

// main();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "snehal@gmail.com" }
  });
  if (!admin) throw new Error("Admin not found");

  await prisma.project.updateMany({ data: { ownerId: admin.userId } });
  await prisma.task.updateMany({ data: { ownerId: admin.userId } });
  await prisma.team.updateMany({ data: { ownerId: admin.userId } });

  console.log("All projects, tasks, teams now owned by Admin");
}

main().finally(() => prisma.$disconnect());
