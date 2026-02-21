import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../services/emailService";

// export const getTasks = async (req: Request, res: Response): Promise<void> => {
//   const { projectId, priority } = req.query;
//   const user = (req as any).user;

//   try {
//     const where: any = {};

//     if (projectId) where.projectId = Number(projectId);
//     if (priority) where.priority = priority;

//     const tasks = await prisma.task.findMany({
//       where,
//       include: {
//         author: true,
//         assignee: true,
//         comments: true,
//         attachments: true,
//       },
//     });

//     res.json(tasks);
//   } catch (error: any) {
//     res.status(500).json({ message: `Error retrieving tasks: ${error.message}` });
//   }
// };
export const getTasks = async (req: Request, res: Response) => {
  const { projectId, priority } = req.query;

  const where: any = {};
  if (projectId) where.projectId = Number(projectId);
  if (typeof priority === "string") where.priority = priority;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      author: true,
      assignee: true,
      comments: true,
      attachments: true,
    },
  });

  const normalized = tasks.map(task => ({
    ...task,
    attachments: task.attachments.map(att => ({
      ...att,
      fileURL: att.fileURL
        ? att.fileURL.startsWith("/uploads")
          ? att.fileURL
          : `/uploads/tasks/${att.fileURL}`
        : null,
    })),
  }));

  res.json(normalized);
};


export const getTasksByPriority = async (req: Request, res: Response) => {
  // const priority = req.params.priority;   // /tasks/priority/Medium
  const user = (req as any).user;
  const priority =
    typeof req.query.priority === "string"
      ? req.query.priority
      : null;

  if (!priority) {
    return res.status(400).json({ message: "Priority is required" });
  }

  const tasks = await prisma.task.findMany({
    where: {
      priority,
      workspaceId: user.workspaceId,
    },
    include: {
      attachments: true,
      author: true,
      assignee: true,
    },
  });
  // ✅ NORMALIZE ATTACHMENT URLs
    const normalizedTasks = tasks.map(task => ({
      ...task,
      attachments: task.attachments.map(att => ({
        ...att,
        fileURL: att.fileURL
          ? att.fileURL.startsWith("/")
            ? att.fileURL
            : `/uploads/tasks/${att.fileURL}`
          : null,
      })),
    }));

    res.json(normalizedTasks)


  if (!priority) {
    return res.status(400).json({ message: "Priority is required" });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        priority,                    // string, safe
        workspaceId: user.workspaceId, // 🔒 only same workspace
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      assignedUserId,
    } = req.body;

    if (!projectId) {
      res.status(400).json({ message: "projectId is required" });
      return;
    }

    const taskData: any = {
      title,
      description,
      status,
      priority,
      tags,
      projectId: Number(projectId),
      authorUserId: user.userId,
      ownerId: user.userId,
      workspaceId: user.workspaceId,
    };

    if (startDate) taskData.startDate = new Date(startDate);
    if (dueDate) taskData.dueDate = new Date(dueDate);
    if (points) taskData.points = Number(points);
    if (assignedUserId) taskData.assignedUserId = Number(assignedUserId);

    const newTask = await prisma.task.create({
      data: taskData,
    });

    // Save image
    if ((req as any).file) {
      const file = (req as any).file;
      const imageUrl = `/uploads/tasks/${file.filename}`;

      await prisma.attachment.create({
        data: {
          fileURL: imageUrl,
          fileName: file.originalname,
          taskId: newTask.id,
          uploadedById: user.userId,
        },
      });
    }

    // 🔥 Fetch task again WITH attachments
    const taskWithRelations = await prisma.task.findUnique({
      where: { id: newTask.id },
      include: {
        attachments: true,
        author: true,
        assignee: true,
      },
    });

    // EMAIL WHEN TASK ASSIGNED
    if (taskWithRelations?.assignee?.email) {
      await sendEmail(
        taskWithRelations.assignee.email,
        "New Task Assigned",
        `<h3>You have a new task</h3>
     <p><b>${taskWithRelations.title}</b></p>
     <p>Status: ${taskWithRelations.status}</p>
     <p>Due: ${taskWithRelations.dueDate}</p>`
      );
    }

    res.status(201).json(taskWithRelations);
  } catch (error: any) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.updateMany({
      where: {
        id: Number(taskId),
        ownerId: (req as any).user.userId,
      },
      data: {
        status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const ownerId = (req as any).user.userId;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        ownerId,
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const user = (req as any).user;

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: Number(taskId),
        workspaceId: user.workspaceId,
      },
      include: {
        attachments: true,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Safety: do NOT allow deleting task with attachments
    if (task.attachments.length > 0) {
      return res.status(400).json({
        message: "Please delete attachments first before deleting this task.",
      });
    }

    await prisma.task.delete({
      where: { id: Number(taskId) },
    });

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
