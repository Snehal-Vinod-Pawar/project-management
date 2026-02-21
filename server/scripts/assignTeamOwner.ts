import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "snehal@gmail.com" },
  });

  if (!admin) throw new Error("Admin not found");

  await prisma.team.updateMany({
    data: { ownerId: admin.userId },
  });

  await prisma.user.updateMany({
    where: { teamId: { not: null } },
    data: { teamId: 1 }, // admin team
  });

  console.log("All teams & users assigned to Admin");
}

main();
