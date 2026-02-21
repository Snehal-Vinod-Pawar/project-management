"use client";

import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode, Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

/* STATUS → COLOR MAP (Timeline specific, NOT board/list) */
const STATUS_COLOR: Record<string, string> = {
  "To Do": "#60A5FA",           // blue
  "Work In Progress": "#34D399", // green
  "Under Review": "#FBBF24",     // amber
  Completed: "#9CA3AF",          // gray
};

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  /* ✅ CORRECT TASK TRANSFORMATION */
  const ganttTasks: GanttTask[] = useMemo(() => {
    if (!tasks) return [];
    
    return tasks
      .filter((task) => task.startDate && task.dueDate)
      .map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? Math.min((task.points / 10) * 100, 100) : 0,
        isDisabled: false,
        styles: {
          backgroundColor: STATUS_COLOR[task.status ?? ""] || "#CBD5E1",
          barBackgroundSelectedColor: isDarkMode ? "#374151" : "#1F2937",
          progressColor: isDarkMode ? "#000000" : "#374151",
          progressSelectedColor: "#111827",
        },
      }));
  }, [tasks, isDarkMode]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  /* STATES */
  if (isLoading) return <div className="px-6 py-10">Loading timeline…</div>;
  if (error) return <div className="px-6 py-10">Failed to load timeline</div>;

  return (
    <div className="px-4 xl:px-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h1 className="text-lg font-bold dark:text-black">
          Project Tasks Timeline
        </h1>

        <div className="flex items-center gap-3">
          <select
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm 
                       hover:border-gray-400 focus:outline-none
                       dark:border-dark-secondary dark:bg-dark-secondary dark:text-gray-500"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>

          <button
            className="rounded bg-blue-primary px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <Legend label="To Do" color="#60A5FA" />
        <Legend label="Work In Progress" color="#34D399" />
        <Legend label="Under Review" color="#FBBF24" />
        <Legend label="Completed" color="#9CA3AF" />
      </div>

      {/* GANTT */}
      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary">
        <Gantt
          tasks={ganttTasks}
          {...displayOptions}
          columnWidth={displayOptions.viewMode === ViewMode.Month ? 140 : 100}
          listCellWidth="160px"
          barCornerRadius={6}
          barFill={60}
          fontFamily="Inter, sans-serif"
          TooltipContent={({ task }) => (
            <div className="rounded-md bg-white p-3 text-sm shadow-lg">
              <p className="font-semibold">{task.name}</p>
              <p className="text-gray-600">
                {task.start.toDateString()} → {task.end.toDateString()}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

/* LEGEND DOT */
const Legend = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <span
      className="h-3 w-3 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
  </div>
);

export default Timeline;

