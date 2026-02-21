import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = 25;

  await prisma.attachment.updateMany({
    data: { uploadedById: userId },
  });

  await prisma.comment.updateMany({
    data: { userId },
  });

  console.log("Attachments & comments assigned to user 25");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
