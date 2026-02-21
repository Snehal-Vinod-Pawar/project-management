"use client";

import React from 'react'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../app/redux';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Home,
    Layers3,
    LockIcon,
    LucideIcon,
    Search,
    Settings,
    ShieldAlert,
    User,
    Users,
    X,
    Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";


const Sidebar = () => {
    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);

    const { data: projects } = useGetProjectsQuery();

    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );

    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(() => router.push("/auth/login"));
    }, [router]);

    const logout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/auth/login");
    };


    // const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    // transition-all duration-300 h-full z-40 dark:bg-dark-bg overflow-y-auto bg-white
    // ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

    const sidebarClassNames = `fixed left-0 top-0 w-64 h-full flex flex-col justify-between shadow-xl
    bg-white dark:bg-dark-bg z-40
    transform transition-transform duration-300
    ${isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"}`;

    // const { user, logout } = useAuth();
    type AuthUser = {
        userId: number;
        username: string;
        email: string;
        profilePictureUrl: string | null;
    };

    const [user, setUser] = useState<AuthUser | null>(null);


    return (
        <div className={sidebarClassNames}>
            <div className="flex h-[100%] w-full flex-col justify-start">
                {/* TOP LOGO */}
                <div className="z-50 flex h-24 w-64 items-center justify-between bg-white px-6 pt-4 dark:bg-dark-bg">

                    <div className="mb-4 mt-2 flex items-center gap-2 ">
                        <Image src="/auth/logo.svg" alt="Project Tool" width={36} height={36} />
                        <span className="text-xl font-bold text-gray-800 dark:text-bg-dark-bg ">Project Tool</span>
                    </div>
                    {isSidebarCollapsed ? null : (
                        <button
                            className="absolute top-3 right-2"
                            onClick={() => {
                                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
                            }}
                        >
                            <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-black" />
                        </button>
                    )}
                </div>
                {/* TEAM */}
                <div className="flex items-center gap-5 border-y-[1.5px] border-gray-100 px-8 py-3 dark:border-gray-200">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || "G"}`
                            }
                            className="w-8 h-8 rounded-full object-cover"
                            alt="avatar"
                        />

                        <div>
                            <h3 className="text-lg font-bold tracking-wide text-[#5B8CFF] capitalize hover:text-[#4F7CFF] transition font-medium">
                                {user ? user.username : "Guest"}
                                {/* EDROH TEAM */}
                            </h3>
                            <div className="mt-1 flex items-start gap-2">
                                <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <p className="text-xs text-gray-500">Private</p>
                            </div>
                        </div>

                    </div>
                </div>
                {/* NAVBAR LINKS */}
                <nav className="z-10 w-full">
                    <SidebarLink icon={Home} label="Home" href="/home" />
                    <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
                    <SidebarLink icon={Search} label="Search" href="/search" />
                    <SidebarLink icon={Settings} label="Settings" href="/settings" />
                    <SidebarLink icon={User} label="Users" href="/users" />
                    <SidebarLink icon={Users} label="Teams" href="/teams" />
                </nav>

                {/* PROJECTS LINKS */}
                <button
                    onClick={() => setShowProjects((prev) => !prev)}
                    className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
                >
                    <span className="">Projects</span>
                    {showProjects ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>

                {/* PROJECTS LIST */}
                {showProjects && projects?.map((project) => (
                    <SidebarLink
                        key={project.id}
                        icon={Briefcase}
                        label={project.name}
                        href={`/projects/${project.id}`}
                    />
                ))
                }

                {/* PRIORITIES LINKS */}
                <button
                    onClick={() => setShowPriority((prev) => !prev)}
                    className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
                >
                    <span className="">Priority</span>
                    {showPriority ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>
                {showPriority && (
                    <>
                        <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
                        <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
                        <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
                        <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
                        <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
                    </>
                )}
                
                {/* GETTING STARTED */}
                <div className="mt-4 border-t border-gray-100 pt-2">
                    <SidebarLink
                        icon={Sparkles}
                        label="Getting Started"
                        href="/onboarding"
                    />
                </div>

                {/* USER PROFILE / LOGOUT */}
                <div className="absolute bottom-0 left-0 bg-white border-t p-3 flex justify-between items-center md:hidden gap-5 border-y-[1.5px] border-gray-100 px-8 py-4 dark:border-gray-200">
                    <div className="flex items-center gap-2 text-black">
                        <User className="w-6 h-6" />
                        <span className="font-medium">{user?.username}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    )
}

interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");
    // const screenWidth = window.innerWidth;

    return (
        <Link href={href} className="w-full">
            <div
                className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-100 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
                    } justify-start px-8 py-3`}
            >
                {isActive && (
                    <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
                )}

                <Icon className="h-6 w-6 text-gray-800 dark:black" />
                <span className={`font-medium text-gray-800 dark:text-black`}>
                    {label}
                </span>
            </div>
        </Link>
    );

}

export default Sidebar