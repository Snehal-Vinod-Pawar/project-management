import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  task: Task;
};

/* Soft background tint (kept) */
const statusBg: Record<string, string> = {
  "To Do": "bg-blue-50",
  "Work In Progress": "bg-emerald-50",
  "Under Review": "bg-amber-50",
  Completed: "bg-neutral-100",
};

/* Text / indicator colors */
const statusText: Record<string, string> = {
  "To Do": "text-blue-700",
  "Work In Progress": "text-emerald-700",
  "Under Review": "text-amber-700",
  Completed: "text-neutral-700",
};

const statusDot: Record<string, string> = {
  "To Do": "bg-blue-500",
  "Work In Progress": "bg-emerald-500",
  "Under Review": "bg-amber-500",
  Completed: "bg-neutral-600",
};

const priorityColors: Record<string, string> = {
  Urgent: "bg-red-50 text-red-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-green-50 text-green-700",
};

const TaskCard = ({ task }: Props) => {
  return (
    <div
      className={`mb-4 rounded-lg border border-gray-200 
      ${statusBg[task.status ?? ""] || "bg-white"}
      transition hover:shadow-sm hover:border-gray-300`}
    >
      <div className="px-5 py-4 text-sm text-gray-700">
        {/* ATTACHMENT */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-md">
            <Image
              src={`/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName}
              width={400}
              height={200}
              className="rounded-md"
            />
            <strong>Attachments:</strong>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">ID: {task.id}</p>

          {task.priority && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          )}
        </div>

        {/* TITLE + STATUS INDICATOR */}
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              statusDot[task.status ?? ""] || "bg-gray-400"
            }`}
          />
          <p
            className={`text-base font-semibold ${
              statusText[task.status ?? ""] || "text-gray-900"
            }`}
          >
            {task.title}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="mb-3 text-gray-600">
          {task.description || "No description provided"}
        </p>

        {/* META */}
        <div className="mb-3 grid grid-cols-2 gap-x-6 gap-y-1">
          <p>
            <span className="font-medium text-gray-600">Status:</span>{" "}
            {task.status}
          </p>
          <p>
            <span className="font-medium text-gray-600">Tags:</span>{" "}
            {task.tags || "No tags"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Start:</span>{" "}
            {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Due:</span>{" "}
            {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between border-t border-gray-200 pt-3 text-gray-600">
          <p>
            <span className="font-medium">Author:</span>{" "}
            {task.author ? task.author.username : "Unknown"}
          </p>
          <p>
            <span className="font-medium">Assignee:</span>{" "}
            {task.assignee ? task.assignee.username : "Unassigned"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;



