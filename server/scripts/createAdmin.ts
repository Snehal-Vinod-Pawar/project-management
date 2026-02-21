import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "snehal@gmail.com" },
    update: {},
    create: {
      email: "snehal@gmail.com",
      username: "Admin",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
