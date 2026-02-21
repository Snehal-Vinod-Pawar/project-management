import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
}

export enum Priority {
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog",
}

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed",
}

export interface User {
    userId?: number;
    username: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
}

export interface Team {
    id: number;
    teamName: string;
    ownerId?: number;
}


export const api = createApi({
    baseQuery: fetchBaseQuery({
        // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, 
        baseUrl: "http://localhost:8000",
        credentials: "include",
    }),
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users", "Teams"],
    endpoints: (build) => ({
        getProjects: build.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects",
                method: "POST",
                body: project,
            }),
            invalidatesTags: ["Projects"],
        }),
        getTasks: build.query<Task[], { projectId: number }>({
            query: ({ projectId }) => `tasks?projectId=${projectId}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
                        { type: "Tasks", id: "LIST" },
                    ]
                    : [{ type: "Tasks", id: "LIST" }],
        }),

        getTasksByUser: build.query<Task[], number>({
            query: (userId) => `tasks/user/${userId}`,
            providesTags: (result, error, userId) =>
                result
                    ? result.map(({ id }) => ({ type: "Tasks", id }))
                    : [{ type: "Tasks", id: userId }],
        }),
        createTask: build.mutation<Task, FormData>({
            query: (task) => ({
                url: "tasks",
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Tasks"],
        }),
        updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
            query: ({ taskId, status }) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: [{ type: "Tasks", id: "LIST" }]
        }),
        deleteTask: build.mutation<{ success: boolean }, number>({
            query: (taskId) => ({
                url: `tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Tasks", id: "LIST" }],
        }),
        getUsers: build.query<User[], void>({
            query: () => "users",
            providesTags: ["Users"],
        }),
        getTeams: build.query<Team[], void>({
            query: () => "teams",
            providesTags: ["Teams"],
        }),
        search: build.query<SearchResults, string>({
            query: (query) => `search?query=${query}`,
        }),

        addUser: build.mutation<any, any>({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),

        deleteUser: build.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
                // credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),
        deleteProject: build.mutation<void, number>({
            query: (projectId) => ({
                url: `projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects"],
        }),
        createTeam: build.mutation<Team, { teamName: string }>({
            query: (body) => ({
                url: "teams",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Teams"],
        }),
        getTasksByPriority: build.query<Task[], Priority>({
            query: (priority) => `tasks/priority/${priority}`,
            providesTags: ["Tasks"],
        }),
        renameProject: build.mutation<Project, { projectId: number; name: string }>({
            query: ({ projectId, name }) => ({
                url: `projects/${projectId}`,
                method: "PATCH",
                body: { name },
            }),
            invalidatesTags: ["Projects"],
        }),
        inviteUserToTeam: build.mutation<
            { message: string },
            { teamId: number; email: string }
        >({
            query: ({ teamId, email }) => ({
                url: `teams/${teamId}/invite`,
                method: "POST",
                body: { email },
            }),
            invalidatesTags: ["Teams"],
        }),
        assignProjectToTeam: build.mutation<
            { success: boolean },
            { projectId: number; teamId: number }
        >({
            query: (body) => ({
                url: "/projects/assign-team",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
    useSearchQuery,
    useGetUsersQuery,
    useDeleteUserMutation,
    useAddUserMutation,
    useGetTeamsQuery,
    useGetTasksByUserQuery,
    useDeleteProjectMutation,
    useCreateTeamMutation,
    useGetTasksByPriorityQuery,
    useRenameProjectMutation,
    useInviteUserToTeamMutation,
    useAssignProjectToTeamMutation,
} = api;