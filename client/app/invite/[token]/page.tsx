"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InviteAcceptPage() {
    const { token } = useParams<{ token: string }>();
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        // prevent double execution (dev strict mode)
        if (sessionStorage.getItem("inviteAccepted")) return;

        const acceptInvite = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invites/${token}/accept`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (res.status === 401) {
                    router.replace("/auth/login");
                    return;
                }

                if (!res.ok) {
                    router.replace("/");
                    return;
                }

                sessionStorage.setItem("inviteAccepted", "true");

                const data = await res.json();
                router.replace(`/projects/${data.projectId}`);
            } catch {
                router.replace("/");
            }
        };

        acceptInvite();
    }, [token, router]);


    return (
        <div className="flex h-[70vh] items-center justify-center text-gray-600">
            Accepting invitation…
        </div>
    );
}
