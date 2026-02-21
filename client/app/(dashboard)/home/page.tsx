"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

/* ---------------- TABLE ---------------- */
const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 220 },
  { field: "status", headerName: "Status", width: 140 },
  { field: "priority", headerName: "Priority", width: 140 },
  { field: "dueDate", headerName: "Due Date", width: 160 },
];

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];

const HomePage: React.FC = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: 1 });

  const {
    data: projects,
    isLoading: projectsLoading,
  } = useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || projectsLoading) return <div>Loading...</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  /* ---------------- PRIORITY ---------------- */
  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      acc[task.priority as Priority] =
        (acc[task.priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const priorityData = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  /* ---------------- TASK STATUS ---------------- */
  const taskStatusCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const status = task.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskStatusData = Object.keys(taskStatusCount).map((key) => ({
    name: key,
    count: taskStatusCount[key],
  }));

  /* ---------------- PROJECT STATUS ---------------- */
  const projectStatusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const projectStatusData = Object.keys(projectStatusCount).map((key) => ({
    name: key,
    count: projectStatusCount[key],
  }));

  /* ---------------- RECENT TASKS ---------------- */
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.dueDate || "").getTime() -
        new Date(a.dueDate || "").getTime()
    )
    .slice(0, 5);

  return (
    <div className="mt-0 min-h-screen bg-[#F7F9FC] py-0 px-6">
      <p className="text-sm text-gray-500">
        Manage and track your projects
      </p>
      <Header name="Project Dashboard" />

      {/* ================= DASHBOARD ================= */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Project Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={projectStatusData}
                dataKey="count"
                innerRadius={70}
                outerRadius={100}
              >
                {projectStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= LOWER SECTION ================= */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-13 font-semibold">Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={taskStatusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#7b43d0"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT TASKS WITH HOVER */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Recent Tasks</h3>
          <ul className="space-y-3">
            {recentTasks.map((task) => (
              <li
                key={task.id}
                className="
                  cursor-pointer
                  rounded-lg border p-3 text-sm
                  transition-all duration-200 ease-out
                  hover:-translate-y-[2px]
                  hover:border-indigo-400
                  hover:bg-indigo-50
                "
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.status} • {task.priority}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Project Summary</h3>
          <p className="text-sm text-gray-600">
            Total Projects: {projects.length}
          </p>
          <p className="text-sm text-gray-600">
            Active: {projectStatusCount["Active"] || 0}
          </p>
          <p className="text-sm text-gray-600">
            Completed: {projectStatusCount["Completed"] || 0}
          </p>
        </div>
      </div>

      {/* ================= TASK TABLE ================= */}
      <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">Your Tasks</h3>
        <div style={{ height: 420 }}>
          <DataGrid
            rows={tasks}
            columns={taskColumns}
            checkboxSelection
            className={dataGridClassNames}
            sx={{
              ...dataGridSxStyles(isDarkMode),

              /* ROW HOVER */
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(99,102,241,0.08)",
                cursor: "pointer",
              },

              /* ROW SELECTED */
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "rgba(99,102,241,0.15)",
              },

              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "rgba(99,102,241,0.2)",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;



