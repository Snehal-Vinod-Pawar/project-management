"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode, Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // const ganttTasks = useMemo(() => {
  //   return (
  //     projects?.map((project) => ({
  //       start: new Date(project.startDate as string),
  //       end: new Date(project.endDate as string),
  //       name: project.name,
  //       id: `Project-${project.id}`,
  //       type: "project" as TaskTypeItems,
  //       progress: 50,
  //       isDisabled: false,
  //     })) || []
  //   );
  // }, [projects]);

  // const ganttTasks: Task[] = useMemo(() => {
  //   if (!projects || projects.length === 0) return [];
  //   const tasks: Task[] = [];

  //   return projects
  //     .filter((p) => p && p.id)
  //     .map((project) => {
  //       const start = project.startDate
  //         ? new Date(project.startDate)
  //         : new Date();

  //       const end = project.endDate
  //         ? new Date(project.endDate)
  //         : new Date(start.getTime() + 24 * 60 * 60 * 1000);

  //       return {
  //         start,
  //         end,
  //         name: project.name || "Untitled Project",
  //         id: `Project-${project.id}`,
  //         type: "project", // ✅ now strongly typed
  //         progress: 50,
  //         hideChildren: true,
  //         isDisabled: false,
  //       };
  //     });
  // }, [projects]);

  const ganttTasks: Task[] = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    const tasks: Task[] = [];

    projects.forEach((project) => {
      if (!project?.id) return;

      const projectStart = project.startDate
        ? new Date(project.startDate)
        : new Date();

      const projectEnd = project.endDate
        ? new Date(project.endDate)
        : new Date(projectStart.getTime() + 24 * 60 * 60 * 1000);

      // 🔹 PROJECT ROW
      tasks.push({
        id: `project-${project.id}`,
        name: project.name ?? "Untitled Project",
        start: projectStart,
        end: projectEnd,
        type: "project",
        progress: 0,
        hideChildren: false,
        isDisabled: true,
      });

      // 🔹 FAKE SAFE CHILD (prevents crash when no tasks exist)
      tasks.push({
        id: `placeholder-${project.id}`,
        name: "No tasks yet",
        start: projectStart,
        end: projectEnd,
        type: "task",
        progress: 0,
        project: `project-${project.id}`,
        isDisabled: true,
      });
    });

    return tasks;
  }, [projects]);


  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div>An error occurred while fetching projects</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select
            className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-black"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 dark:bg-dark-secondary dark:ring-dark-tertiary">
        {ganttTasks.length > 0 && (
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 110}
            listCellWidth="140px"

            projectBackgroundColor={
              isDarkMode ? "#2563eb" : "#60a5fa"   // blue
            }
            projectProgressColor={
              isDarkMode ? "#16a34a" : "#4ade80"  // green
            }
            projectProgressSelectedColor={
              isDarkMode ? "#7c3aed" : "#a78bfa"  // violet
            }

            /* polish */
            todayColor={isDarkMode ? "#334155" : "#e0f2fe"}
          />
        )}

      </div>
    </div>
  );
};

export default Timeline;
