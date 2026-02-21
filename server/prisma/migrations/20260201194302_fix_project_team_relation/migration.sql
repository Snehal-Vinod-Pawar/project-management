/*
  Warnings:

  - A unique constraint covering the columns `[projectId,teamId]` on the table `ProjectTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectTeam_projectId_teamId_key" ON "ProjectTeam"("projectId", "teamId");
