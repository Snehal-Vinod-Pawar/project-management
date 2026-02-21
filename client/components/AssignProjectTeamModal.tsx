"use client";

import Modal from "@/components/Modal";
import { useGetTeamsQuery, useAssignProjectToTeamMutation } from "@/state/api";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName?: string;
};

export default function AssignProjectToTeamModal({
  isOpen,
  onClose,
  projectId,
  projectName,
}: Props) {
  const { data: teams = [] } = useGetTeamsQuery();
  const [assignTeam, { isLoading }] = useAssignProjectToTeamMutation();

  // ✅ null instead of "" → prevents NaN issues
  const [teamId, setTeamId] = useState<number | null>(null);

  const handleAssign = async () => {
    if (!teamId) return;

    try {
      await assignTeam({ projectId, teamId }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to assign team:", err);
      alert("Failed to assign project to team");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Assign Project to Team">
      <div className="space-y-4">
        {projectName && (
          <p className="text-sm text-gray-600">
            Project: <b>{projectName}</b>
          </p>
        )}

        <select
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
          value={teamId ?? ""}
          onChange={(e) =>
            setTeamId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Select a team</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.teamName}
            </option>
          ))}
        </select>

        <button
          disabled={!teamId || isLoading}
          onClick={handleAssign}
          className={`w-full rounded-md py-2 text-white font-medium transition
            ${
              !teamId || isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
        >
          {isLoading ? "Assigning..." : "Assign Team"}
        </button>
      </div>
    </Modal>
  );
}
