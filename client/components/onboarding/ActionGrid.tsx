"use client";

import { useState } from "react";
import ActionCard from "./ActionCard";
import { FolderPlus, UserPlus, Users, ClipboardList } from "lucide-react";
import ModalNewProject from "@/app/(dashboard)/projects/ModalNewProject";
import ModalNewTask from "../ModalNewTask";
import InviteMemberModal from "@/components/InviteMemberModal";
import ModalNewTeam from "../ModalNewTeam";
import { useGetProjectsQuery } from "@/state/api";

export default function ActionGrid() {
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const { data: projects } = useGetProjectsQuery();
  const firstProjectId = projects?.[0]?.id;

  const [openInvite, setOpenInvite] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ActionCard
          title="Create Project"
          description="Start by creating your first board"
          icon={<FolderPlus size={28} />}
          onClick={() => setOpenProjectModal(true)}
        />

        <ActionCard
          title="Invite Team"
          description="Add members to collaborate"
          icon={<UserPlus size={28} />}
          onClick={() => setOpenInvite(true)}
        />

        <ActionCard
          title="Create Team"
          description="Organize users into teams"
          icon={<Users size={28} />}
          onClick={() => setOpenTeamModal(true)}
        />

        <ActionCard
          title="Assign Task"
          description="Create and assign your first task"
          icon={<ClipboardList size={28} />}
          onClick={() => setOpenTaskModal(true)}
        />
      </div>

      <ModalNewProject
        isOpen={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
      />

      {firstProjectId && (
        <ModalNewTask
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          id={String(firstProjectId)}
        />
      )}

      {firstProjectId && (
        <InviteMemberModal
          isOpen={openInvite}
          onClose={() => setOpenInvite(false)}
          teamId={firstProjectId}
        />
      )}

      <ModalNewTeam
        isOpen={openTeamModal}
        onClose={() => setOpenTeamModal(false)}
      />

    </>
  );
}
