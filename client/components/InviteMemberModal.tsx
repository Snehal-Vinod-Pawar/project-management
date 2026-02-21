"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { useInviteUserToTeamMutation} from "@/state/api";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    teamId: number;
};

export default function InviteMemberModal({ isOpen, onClose,teamId }: Props) {
    const [email, setEmail] = useState("");
    const [inviteUser, { isLoading }] = useInviteUserToTeamMutation();

    const handleInvite = async () => {
        if (!email) return;
        await inviteUser({ teamId, email }).unwrap();
        setEmail("");
        onClose();
    };

    const isFormValid = () => {
        return email.trim().length > 0;
    };

    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm transition focus:border-blue-50 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-black"; 

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Invite Team Member">
            <div className="space-y-4">
                <input
                    className={inputStyles}
                    placeholder="Enter user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type="button"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600
                       ${!isFormValid() || isLoading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"}
                        `}
                    disabled={!isFormValid() || isLoading}
                    onClick={handleInvite}
                >
                    {isLoading ? "Inviting..." : "Invite Member"}
                </button>



            </div>
        </Modal>
    );
}
