"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { useCreateTeamMutation } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalNewTeam({ isOpen, onClose }: Props) {
  const [teamName, setTeamName] = useState("");
  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const isFormValid = () => teamName.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    await createTeam({ teamName });
    setTeamName("");
    onClose();
  };

  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm transition focus:border-blue-50 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-black"; 

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create Team">
      <input
        className={inputStyles}
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <button
        className={`mt-4 w-full rounded py-2 text-white
          ${!isFormValid() || isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"}
        `}
        disabled={!isFormValid() || isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Creating..." : "Create Team"}
      </button>
    </Modal>
  );
}
