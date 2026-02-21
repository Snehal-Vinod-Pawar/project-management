"use client";

import React, { useState } from "react"
import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
  MoreVertical
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ModalNewProject from "./ModalNewProject";
import { useDeleteProjectMutation, useRenameProjectMutation } from "@/state/api";
import AssignProjectToTeamModal from "@/components/AssignProjectTeamModal";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [renameProject] = useRenameProjectMutation();
  const [newName, setNewName] = useState("");
  const router = useRouter();
  const [deleteProject] = useDeleteProjectMutation();
  const [showAssignTeamModal, setShowAssignTeamModal] = useState(false);
  const params = useParams();
  // const projectId = params.projectId as String;
  const projectId = Number(params.id);

  return (
    <div className="px-4 xl:px-6">
      {/* MODAL NEW PROJECT */}
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      <div className="flex items-center justify-between">
        <Header name="Product Design Development" />

        <div className="flex items-center gap-2 relative">
          <button
            className="flex items-center rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-500"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" />New Boards
          </button>
          <button
            onClick={() => setShowAssignTeamModal(true)}
            className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Assign Team
          </button>

          {/* Three-dot menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 translate-x-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
              <MenuItem label="Rename Project" onClick={() => setShowRename(true)} />
              <MenuItem label="Project Settings" onClick={() => router.push(`/teams`)} />
              <MenuItem label="Manage Members" onClick={() => router.push(`/users`)} />

              <div className="h-px bg-gray-100 my-1" />

              <MenuItem danger label="Delete Project" onClick={() => setConfirmDelete(true)} />
            </div>
          )}

        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-4 border-b border-gray-300 dark:border-neutral-300">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-black"
            />
            <Grid3x3 className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-400" />
          </div>
        </div>
      </div>
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold">Delete Project?</h3>
            <p className="text-gray-500 mt-1">
              This will permanently delete this project.
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await deleteProject(projectId).unwrap();
                    router.push("/");   // go back to projects list
                    router.refresh();              // force server re-render
                  } catch (err: any) {
                    alert("Failed to delete project");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {showRename && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold">Rename Project</h3>

            <input
              className="mt-3 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowRename(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  await renameProject({ projectId: Number(projectId), name: newName }).unwrap();
                  setShowRename(false);
                  router.refresh();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignTeamModal && (
        <AssignProjectToTeamModal
          isOpen={showAssignTeamModal}
          projectId={projectId} // from route param
          onClose={() => setShowAssignTeamModal(false)}
        />
      )}

    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-gray sm:px-2 lg:px-4 ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-black" : ""
        }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

const MenuItem = ({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
};


export default ProjectHeader;