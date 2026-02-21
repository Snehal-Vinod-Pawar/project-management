/*
  Warnings:

  - You are about to drop the column `productOwnerUserId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `projectManagerUserId` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "productOwnerUserId",
DROP COLUMN "projectManagerUserId";
