import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function fixPasswords() {
  const users = await prisma.user.findMany();

  for (const user of users) {

    // skip if no password
    if (!user.password) continue;

    // skip if already hashed
    if (user.password.startsWith("$2b$")) continue;

    // skip if email null (cannot update by null)
    if (!user.email) {
      console.log("Skipped (no email):", user.username);
      continue;
    }

    const hashed = await bcrypt.hash(user.password, 10);

    await prisma.user.update({
      where: { email: user.email },   // safe now
      data: { password: hashed },
    });

    console.log("Fixed:", user.email);
  }

  console.log("ALL PASSWORDS FIXED");
}

fixPasswords().finally(() => prisma.$disconnect());