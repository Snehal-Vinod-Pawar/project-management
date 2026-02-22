--
-- PostgreSQL database dump
--

\restrict xwfdaz4d2V5RcFpSMPfsWCd5s3ryU6q3wNyRTWVMebH8X51NBL0H5zEOvuK9w7g

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'MANAGER',
    'CONTRIBUTOR',
    'VIEWER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attachment" (
    id text NOT NULL,
    "fileURL" text NOT NULL,
    "fileName" text,
    "taskId" integer NOT NULL,
    "uploadedById" integer NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    text text NOT NULL,
    "taskId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invite" (
    id text NOT NULL,
    email text NOT NULL,
    "projectId" integer,
    "teamId" integer,
    role text DEFAULT 'Member'::text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Invite" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "ownerId" integer,
    "workspaceId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: ProjectMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectMember" (
    id integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" integer NOT NULL,
    role text DEFAULT 'Member'::text NOT NULL
);


ALTER TABLE public."ProjectMember" OWNER TO postgres;

--
-- Name: ProjectMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProjectMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProjectMember_id_seq" OWNER TO postgres;

--
-- Name: ProjectMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProjectMember_id_seq" OWNED BY public."ProjectMember".id;


--
-- Name: ProjectTeam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectTeam" (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "projectId" integer NOT NULL
);


ALTER TABLE public."ProjectTeam" OWNER TO postgres;

--
-- Name: ProjectTeam_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProjectTeam_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProjectTeam_id_seq" OWNER TO postgres;

--
-- Name: ProjectTeam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProjectTeam_id_seq" OWNED BY public."ProjectTeam".id;


--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Project_id_seq" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    status text,
    priority text,
    tags text,
    "startDate" timestamp(3) without time zone,
    "dueDate" timestamp(3) without time zone,
    points integer,
    "projectId" integer NOT NULL,
    "authorUserId" integer NOT NULL,
    "assignedUserId" integer,
    "ownerId" integer,
    "workspaceId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: TaskAssignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TaskAssignment" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "taskId" integer NOT NULL
);


ALTER TABLE public."TaskAssignment" OWNER TO postgres;

--
-- Name: TaskAssignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TaskAssignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TaskAssignment_id_seq" OWNER TO postgres;

--
-- Name: TaskAssignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TaskAssignment_id_seq" OWNED BY public."TaskAssignment".id;


--
-- Name: Task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Task_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Task_id_seq" OWNER TO postgres;

--
-- Name: Task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Task_id_seq" OWNED BY public."Task".id;


--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    id integer NOT NULL,
    "teamName" text NOT NULL,
    "ownerId" integer,
    "workspaceId" integer
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: Team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Team_id_seq" OWNER TO postgres;

--
-- Name: Team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Team_id_seq" OWNED BY public."Team".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "userId" integer NOT NULL,
    username text,
    "profilePictureUrl" text,
    "teamId" integer,
    email text,
    password text,
    "workspaceId" integer
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_userId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_userId_seq" OWNER TO postgres;

--
-- Name: User_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_userId_seq" OWNED BY public."User"."userId";


--
-- Name: Workspace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Workspace" (
    id integer NOT NULL,
    name text NOT NULL,
    "ownerId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Workspace" OWNER TO postgres;

--
-- Name: Workspace_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Workspace_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Workspace_id_seq" OWNER TO postgres;

--
-- Name: Workspace_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Workspace_id_seq" OWNED BY public."Workspace".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- Name: ProjectMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember" ALTER COLUMN id SET DEFAULT nextval('public."ProjectMember_id_seq"'::regclass);


--
-- Name: ProjectTeam id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTeam" ALTER COLUMN id SET DEFAULT nextval('public."ProjectTeam_id_seq"'::regclass);


--
-- Name: Task id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task" ALTER COLUMN id SET DEFAULT nextval('public."Task_id_seq"'::regclass);


--
-- Name: TaskAssignment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskAssignment" ALTER COLUMN id SET DEFAULT nextval('public."TaskAssignment_id_seq"'::regclass);


--
-- Name: Team id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team" ALTER COLUMN id SET DEFAULT nextval('public."Team_id_seq"'::regclass);


--
-- Name: User userId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userId" SET DEFAULT nextval('public."User_userId_seq"'::regclass);


--
-- Name: Workspace id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workspace" ALTER COLUMN id SET DEFAULT nextval('public."Workspace_id_seq"'::regclass);


--
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attachment" (id, "fileURL", "fileName", "taskId", "uploadedById") FROM stdin;
1	i1.jpg	DesignDoc.pdf	1	1
2	i2.jpg	NavAlgorithm.pdf	2	3
3	i3.jpg	EnergySolutions.pdf	3	5
4	i4.jpg	SoftwareWorkflow.pdf	4	7
5	i5.jpg	AIPredictions.pdf	5	9
6	i6.jpg	BiotechTest.pdf	6	11
7	i7.jpg	GolfAI.pdf	7	13
8	i8.jpg	HotelDB.pdf	8	15
9	i9.jpg	TelecomUpgrade.pdf	9	17
10	i10.jpg	SecurityProtocol.pdf	10	19
760d4ac2-395d-470b-b2fb-f29772abfec1	/uploads/tasks/1769284207547-i7.jpg	i7.jpg	63	25
952c99da-3c02-42ee-b248-18efd1365561	/uploads/tasks/1769889774750-i5.jpg	i5.jpg	65	42
31c5446a-f29e-492f-be7d-620890b13866	/uploads/tasks/1769962085536-i9.jpg	i9.jpg	66	25
382cdaaa-284d-4ff8-bc79-a12cc1c7815b	/uploads/tasks/1770063242574-i1.jpg	i1.jpg	67	22
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, text, "taskId", "userId") FROM stdin;
1	We need to update this design to include new specifications.	1	2
2	Can we meet to discuss the navigation algorithm updates?	2	4
3	This energy solution looks promising, but needs more research.	3	6
4	Let's revise the software development workflow to include agile methodologies.	4	8
5	We should consider newer AI models for better accuracy.	5	10
6	Product testing needs to be more rigorous.	6	12
7	Optimization algorithms are not yet efficient.	7	14
8	Database overhaul could impact current operations negatively.	8	16
9	Infrastructure upgrades must be done during low traffic hours.	9	18
10	Security measures need to be enhanced to prevent data breaches.	10	20
11	Consider using more robust training datasets for AI.	11	1
12	Server security update meeting scheduled for next week.	12	2
13	UX redesign has been well received in initial user tests.	13	3
14	Data analytics implementation needs to account for real-time processing delays.	14	4
15	Encryption project needs to align with international security standards.	15	5
16	Review cloud storage optimization strategies in Q3 meeting.	16	6
17	Hardware compatibility tests to include newer device models.	17	7
18	Visualization tools to support both 2D and 3D data representations.	18	8
19	IoT device prototypes to undergo extensive field testing.	19	9
20	Legacy system upgrade to start with backend databases.	20	10
21	Network security framework should prioritize threat detection improvements.	21	1
22	Application deployment strategies to include Docker integration.	22	2
23	Market analysis should cover competitive product landscapes.	23	3
24	Feedback mechanisms to utilize adaptive questioning techniques.	24	4
25	API integration must ensure data privacy compliance.	25	5
\.


--
-- Data for Name: Invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invite" (id, email, "projectId", "teamId", role, token, "expiresAt", used, "createdAt") FROM stdin;
5f3a1b81-9486-4eb7-b040-f1a36abd297a	snehalpawar2005@gmail.com	11	\N	Member	fb8ebcbf03f5bff0122c518c05ea0dd390bf014842917f4ea3aeae206fe22474	2026-02-01 19:25:19.13	f	2026-01-31 19:25:19.133
dd3f5c74-0fc4-4174-9feb-78ef1db324c4	snehalpawar2005@gmail.com	11	\N	Member	b3f3d3c72d163f70dcc5cc564fd5de68cc8a12a66dea4f6aa1c483718b1d6c51	2026-02-01 19:28:06.679	f	2026-01-31 19:28:06.68
7fa7fb61-f79c-4e00-9523-3e09435be4c3	snehalpawar2005@gmail.com	11	\N	Member	7ac995735eff9ce98c1d7967eeb2e76cb0353e3c1d0b6301a2c5a99868f67dca	2026-02-01 19:31:00.949	f	2026-01-31 19:31:00.95
5937f165-2e84-494f-889d-c6320c10634e	snehalpawar2005@gmail.com	11	\N	Member	20156ca32bb743ea5e4a19da407c0ccebcb3967956a363208eb4aea7341259e1	2026-02-01 19:44:09.339	f	2026-01-31 19:44:09.342
3c988f2e-3528-4823-88c6-e8a3b0859b81	snehalpawar2005@gmail.com	11	\N	Member	857bba906aabb9f7e4cfb88f777e49021332fbbcc43fd671f18d7f635e17e063	2026-02-01 19:47:27.962	f	2026-01-31 19:47:27.963
0e39518c-f346-4e5e-b02e-7d825261b9fe	snehalpawar2005@gmail.com	11	\N	Member	b8ad97d0c6e30d5c6396a359130d36861cb54e7ac419a9a390d189f9eeec47e9	2026-02-01 19:53:40.687	t	2026-01-31 19:53:40.688
c1374877-1fb7-4285-9914-9a8e434a7ae7	snehalpawar2005@gmail.com	11	\N	Member	0ea6d8135da22072dde088fbaa47486761804fdff8f89f14a4f7359fcfa48106	2026-02-01 19:57:13.558	t	2026-01-31 19:57:13.559
50d3b47f-5349-459f-963c-89ecd76e86fe	snehalpawar2005@gmail.com	11	\N	Member	faf2f2309bdb0f0685e7180ed015a67b5b5ecafe0c37b4f698cebce29c40ad0e	2026-02-01 19:59:55.862	t	2026-01-31 19:59:55.864
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, description, "startDate", "endDate", "ownerId", "workspaceId", "createdAt", status) FROM stdin;
1	Apollo	A space exploration project.	2023-01-01 00:00:00	2023-12-31 00:00:00	22	1	2026-01-17 12:18:27.154	Active
2	Beacon	Developing advanced navigation systems.	2023-02-01 00:00:00	2023-10-15 00:00:00	22	1	2026-01-17 12:18:27.154	Active
3	Catalyst	A project to boost renewable energy use.	2023-03-05 00:00:00	2024-03-05 00:00:00	22	1	2026-01-17 12:18:27.154	Active
4	Delta	Delta project for new software development techniques.	2023-01-20 00:00:00	2023-09-20 00:00:00	22	1	2026-01-17 12:18:27.154	Active
5	Echo	Echo project focused on AI advancements.	2023-04-15 00:00:00	2023-11-30 00:00:00	22	1	2026-01-17 12:18:27.154	Active
6	Foxtrot	Exploring cutting-edge biotechnology.	2023-02-25 00:00:00	2023-08-25 00:00:00	22	1	2026-01-17 12:18:27.154	Active
7	Golf	Development of new golf equipment using AI.	2023-05-10 00:00:00	2023-12-10 00:00:00	22	1	2026-01-17 12:18:27.154	Active
8	Hotel	Hotel management system overhaul.	2023-03-01 00:00:00	2024-01-01 00:00:00	22	1	2026-01-17 12:18:27.154	Active
9	India	Telecommunication infrastructure upgrade.	2023-06-01 00:00:00	2023-12-01 00:00:00	22	1	2026-01-17 12:18:27.154	Active
10	Juliet	Initiative to enhance cyber-security measures.	2023-07-01 00:00:00	2024-02-01 00:00:00	22	1	2026-01-17 12:18:27.154	Active
11	Delloite	App Deployement	2026-01-17 00:00:00	2026-02-28 00:00:00	25	2	2026-01-17 09:12:24.876	Active
19	oh ho hohoo	dsaf	2026-01-07 00:00:00	2026-01-08 00:00:00	25	\N	2026-01-25 19:46:39.446	Active
20	yo yo	sgsg	2026-02-02 00:00:00	2026-02-28 00:00:00	25	\N	2026-02-01 16:00:12.218	Active
\.


--
-- Data for Name: ProjectMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectMember" (id, "projectId", "userId", role) FROM stdin;
1	11	22	Member
8	19	25	Owner
9	11	42	Member
11	20	25	Owner
\.


--
-- Data for Name: ProjectTeam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectTeam" (id, "teamId", "projectId") FROM stdin;
1	1	1
2	2	1
3	3	1
4	4	1
5	5	1
6	1	2
7	2	2
8	3	2
9	4	2
10	5	2
11	1	3
12	2	3
13	3	3
14	4	3
15	5	3
16	1	4
17	2	4
18	3	4
19	4	4
20	5	4
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, status, priority, tags, "startDate", "dueDate", points, "projectId", "authorUserId", "assignedUserId", "ownerId", "workspaceId", "createdAt") FROM stdin;
21	Task 21	Establish new network security framework.	Work In Progress	Urgent	Security	2023-01-30 00:00:00	2023-05-30 00:00:00	\N	10	1	3	\N	1	2026-01-17 12:18:27.154
22	Task 22	Revise application deployment strategies.	To Do	High	Deployment	2023-02-20 00:00:00	2023-06-20 00:00:00	\N	1	2	4	\N	1	2026-01-17 12:18:27.154
23	Task 23	Conduct market analysis for product fit.	Work In Progress	Urgent	Market Analysis	2023-03-25 00:00:00	2023-07-25 00:00:00	\N	2	5	6	\N	1	2026-01-17 12:18:27.154
24	Task 24	Optimize user feedback collection mechanism.	To Do	High	Feedback	2023-04-15 00:00:00	2023-08-15 00:00:00	\N	3	7	8	\N	1	2026-01-17 12:18:27.154
25	Task 25	Integrate new API for third-party services.	Work In Progress	Urgent	API Integration	2023-05-05 00:00:00	2023-09-05 00:00:00	\N	4	9	10	\N	1	2026-01-17 12:18:27.154
26	Task 26	Update internal tooling for development teams.	To Do	Backlog	Tooling	2023-06-25 00:00:00	2023-10-25 00:00:00	\N	5	11	12	\N	1	2026-01-17 12:18:27.154
27	Task 27	Prepare cloud migration strategy document.	Work In Progress	Urgent	Cloud Migration	2023-07-20 00:00:00	2023-11-20 00:00:00	\N	6	13	14	\N	1	2026-01-17 12:18:27.154
28	Task 28	Design scalable database architecture.	To Do	Medium	Database Design	2023-08-15 00:00:00	2023-12-15 00:00:00	\N	7	15	16	\N	1	2026-01-17 12:18:27.154
29	Task 29	Prototype new mobile technology.	Work In Progress	Urgent	Mobile Tech	2023-09-10 00:00:00	2024-01-10 00:00:00	\N	8	17	18	\N	1	2026-01-17 12:18:27.154
30	Task 30	Enhance data encryption levels.	To Do	High	Encryption	2023-10-15 00:00:00	2024-02-15 00:00:00	\N	9	19	20	\N	1	2026-01-17 12:18:27.154
31	Task 31	Refactor backend code for better maintainability.	Work In Progress	Urgent	Refactoring, Backend	2023-11-01 00:00:00	2024-03-01 00:00:00	\N	10	20	1	\N	1	2026-01-17 12:18:27.154
32	Task 32	Expand the network infrastructure to support increased traffic.	To Do	Medium	Networking, Infrastructure	2023-11-05 00:00:00	2024-01-05 00:00:00	\N	1	2	3	\N	1	2026-01-17 12:18:27.154
33	Task 33	Create a new client dashboard interface.	Work In Progress	Urgent	UI, Dashboard	2023-11-10 00:00:00	2024-02-10 00:00:00	\N	2	4	5	\N	1	2026-01-17 12:18:27.154
34	Task 34	Develop an automated testing framework for new software releases.	To Do	Medium	Testing, Automation	2023-11-15 00:00:00	2024-03-15 00:00:00	\N	3	6	7	\N	1	2026-01-17 12:18:27.154
35	Task 35	Optimize database queries to improve application performance.	Work In Progress	Urgent	Database, Optimization	2023-11-20 00:00:00	2024-01-20 00:00:00	\N	4	8	9	\N	1	2026-01-17 12:18:27.154
46	Testing API	put,post,patch ,delete	To Do	Medium	..	2026-01-17 00:00:00	2026-01-21 00:00:00	\N	11	25	22	25	2	2026-01-17 11:43:55.558
43	Testing Routes	Routes, middleware ,schemas	Work In Progress	Backlog	today	2026-01-17 00:00:00	2026-01-20 00:00:00	\N	11	25	22	25	2	2026-01-17 11:31:17.791
52	Add ChatBot	New AI features	Under Review	Urgent		2026-01-24 00:00:00	2026-01-31 00:00:00	\N	11	25	40	25	2	2026-01-24 16:22:01.849
36	Task 36	Implement end-user training for new system features.	To Do	Backlog	Training, User Experience	2023-11-25 00:00:00	2024-01-25 00:00:00	\N	5	10	11	\N	1	2026-01-17 12:18:27.154
37	Task 37	Conduct a comprehensive security audit of the existing infrastructure.	Work In Progress	Urgent	Security, Audit	2023-12-01 00:00:00	2024-02-01 00:00:00	\N	6	12	13	\N	1	2026-01-17 12:18:27.154
38	Task 38	Revise mobile app to incorporate new payment integrations.	To Do	Medium	Mobile, Payments	2023-12-05 00:00:00	2024-02-05 00:00:00	\N	7	14	15	\N	1	2026-01-17 12:18:27.154
39	Task 39	Update cloud configuration to optimize costs.	Work In Progress	Urgent	Cloud, Cost Saving	2023-12-10 00:00:00	2024-02-10 00:00:00	\N	8	16	17	\N	1	2026-01-17 12:18:27.154
40	Task 40	Implement automated backup procedures for critical data.	To Do	High	Backup, Automation	2023-12-15 00:00:00	2024-02-15 00:00:00	\N	9	18	19	\N	1	2026-01-17 12:18:27.154
2	Task 2	Implement the navigation algorithm.	To Do	High	Coding	2023-01-15 00:00:00	2023-05-15 00:00:00	\N	2	3	4	22	1	2026-01-17 12:18:27.154
4	Task 4	Outline new software development workflows.	To Do	High	Planning	2023-01-25 00:00:00	2023-06-25 00:00:00	\N	4	7	8	22	1	2026-01-17 12:18:27.154
6	Task 6	Biotech product testing.	To Do	Backlog	Testing	2023-03-01 00:00:00	2023-08-01 00:00:00	\N	6	11	12	22	1	2026-01-17 12:18:27.154
5	Task 5	Research AI models for prediction.	Work In Progress	Urgent	Research	2023-04-20 00:00:00	2023-10-20 00:00:00	\N	5	9	10	22	1	2026-01-17 12:18:27.154
7	Task 7	AI optimization for golf equipment.	Work In Progress	Urgent	Optimization	2023-05-15 00:00:00	2023-11-15 00:00:00	\N	7	13	14	22	1	2026-01-17 12:18:27.154
8	Task 8	Overhaul of the database for hotel management.	To Do	High	Database	2023-04-01 00:00:00	2023-10-01 00:00:00	\N	8	15	16	22	1	2026-01-17 12:18:27.154
9	Task 9	Upgrade telecom infrastructure.	Work In Progress	Urgent	Infrastructure	2023-06-10 00:00:00	2023-12-10 00:00:00	\N	9	17	18	22	1	2026-01-17 12:18:27.154
10	Task 10	Enhance security protocols.	To Do	Urgent	Security	2023-07-05 00:00:00	2024-01-05 00:00:00	\N	10	19	20	22	1	2026-01-17 12:18:27.154
11	Task 11	Finalize AI training parameters.	Work In Progress	Urgent	AI, Training	2023-01-20 00:00:00	2023-05-20 00:00:00	\N	5	1	3	22	1	2026-01-17 12:18:27.154
1	Task 1	Design the main module.	Work In Progress	Urgent	Design	2023-01-10 00:00:00	2023-04-10 00:00:00	\N	1	1	2	22	1	2026-01-17 12:18:27.154
12	Task 12	Update server security protocols.	To Do	High	Security	2023-02-10 00:00:00	2023-06-10 00:00:00	\N	1	2	4	22	1	2026-01-17 12:18:27.154
13	Task 13	Redesign user interface for better UX.	Work In Progress	Urgent	Design, UX	2023-03-15 00:00:00	2023-07-15 00:00:00	\N	2	5	6	22	1	2026-01-17 12:18:27.154
15	Task 15	Develop end-to-end encryption solution.	Work In Progress	Urgent	Encryption	2023-05-01 00:00:00	2023-09-01 00:00:00	\N	4	9	10	22	1	2026-01-17 12:18:27.154
14	Task 14	Implement real-time data analytics.	To Do	High	Analytics	2023-04-05 00:00:00	2023-08-05 00:00:00	\N	3	7	8	22	1	2026-01-17 12:18:27.154
17	Task 17	Test software for hardware compatibility.	Work In Progress	Urgent	Testing, Hardware	2023-07-10 00:00:00	2023-11-10 00:00:00	\N	6	13	14	22	1	2026-01-17 12:18:27.154
16	Task 16	Optimize cloud storage usage.	To Do	Backlog	Cloud, Storage	2023-06-15 00:00:00	2023-10-15 00:00:00	\N	5	11	12	22	1	2026-01-17 12:18:27.154
18	Task 18	Create new data visualization tools.	To Do	High	Visualization	2023-08-05 00:00:00	2023-12-05 00:00:00	\N	7	15	16	22	1	2026-01-17 12:18:27.154
19	Task 19	Build prototype for new IoT devices.	Work In Progress	Urgent	IoT	2023-09-01 00:00:00	2024-01-01 00:00:00	\N	8	17	18	22	1	2026-01-17 12:18:27.154
20	Task 20	Update legacy systems to new tech standards.	To Do	Urgent	Legacy, Upgrade	2023-10-10 00:00:00	2024-02-10 00:00:00	\N	9	19	20	22	1	2026-01-17 12:18:27.154
63	n,	n.mn	Work In Progress	Backlog		2026-02-02 00:00:00	2026-02-07 00:00:00	\N	11	25	40	25	2	2026-01-24 19:50:07.603
64	faf	aad	To Do	Backlog	aad	2026-01-29 00:00:00	2026-02-05 00:00:00	\N	11	25	40	25	2	2026-01-25 19:40:14.416
65	nlnlnk	gk,h	To Do	Backlog	g	2026-02-02 00:00:00	2026-02-26 00:00:00	\N	11	42	25	42	\N	2026-01-31 20:02:54.79
66	Build API's	Deadline is tight 	Under Review	High	af	2026-02-01 00:00:00	2026-02-10 00:00:00	\N	20	25	25	25	2	2026-02-01 16:08:05.633
67	z eg	gsgd	Completed	Medium		2026-02-01 00:00:00	2026-02-02 00:00:00	\N	5	22	25	22	1	2026-02-02 20:14:02.591
3	Task 3	Develop renewable energy solutions.	Completed	Urgent	Development	2023-03-20 00:00:00	2023-09-20 00:00:00	\N	3	5	6	22	1	2026-01-17 12:18:27.154
54	Add Chatbot	Add new AI features 	Completed	High		2026-01-24 00:00:00	2026-01-31 00:00:00	\N	11	25	40	25	2	2026-01-24 16:30:48.602
56	Add AI Chatbot	Make a chatbot for the your new project	Under Review	Medium		2026-01-31 00:00:00	2026-02-07 00:00:00	\N	11	25	40	25	2	2026-01-24 16:48:47.577
\.


--
-- Data for Name: TaskAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TaskAssignment" (id, "userId", "taskId") FROM stdin;
1	1	1
2	2	2
3	3	3
4	4	4
5	5	5
6	6	6
7	7	7
8	8	8
9	9	9
10	10	10
11	11	11
12	12	12
13	13	13
14	14	14
15	15	15
16	16	16
17	17	17
18	18	18
19	19	19
20	20	20
21	1	21
22	2	22
23	3	23
24	4	24
25	5	25
26	6	26
27	7	27
28	8	28
29	9	29
30	10	30
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" (id, "teamName", "ownerId", "workspaceId") FROM stdin;
1	Quantum Innovations	22	1
2	Nebula Research	22	1
3	Orion Solutions	22	1
4	Krypton Developments	22	1
5	Zenith Technologies	22	1
6	Testing Team	25	2
7	My Team	25	\N
8	New Team	25	\N
9	Next Team	25	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("userId", username, "profilePictureUrl", "teamId", email, password, "workspaceId") FROM stdin;
42	SNEHAL PAWAR	https://lh3.googleusercontent.com/a/ACg8ocK2UQaKkFqZP_CJAChFbcfEE1eK18dJkoi81tCXoiVifWMb3A=s96-c	9	snehalpawar2005@gmail.com	\N	\N
1	AliceJones	p1.jpeg	1	\N	\N	1
2	BobSmith	p2.jpeg	2	\N	\N	1
3	CarolWhite	p3.jpeg	3	\N	\N	1
4	DaveBrown	p4.jpeg	4	\N	\N	1
5	EveClark	p5.jpeg	5	\N	\N	1
6	FrankWright	p6.jpeg	1	\N	\N	1
7	GraceHall	p7.jpeg	2	\N	\N	1
8	HenryAllen	p8.jpeg	3	\N	\N	1
9	IdaMartin	p9.jpeg	4	\N	\N	1
10	JohnDoe	p10.jpeg	5	\N	\N	1
11	LauraAdams	p11.jpeg	1	\N	\N	1
12	NormanBates	p12.jpeg	2	\N	\N	1
13	OliviaPace	p13.jpeg	3	\N	\N	1
14	PeterQuill	p1.jpeg	4	\N	\N	1
15	QuincyAdams	p2.jpeg	5	\N	\N	1
16	RachelGreen	p3.jpeg	1	\N	\N	1
17	SteveJobs	p4.jpeg	2	\N	\N	1
18	TinaFey	p5.jpeg	3	\N	\N	1
19	UrsulaMonroe	p6.jpeg	4	\N	\N	1
20	VictorHugo	p7.jpeg	5	\N	\N	1
22	Snehal	\N	1	snehal@gmail.com	$2b$10$VzjohCBHuhGehUgS/P4wNuUqZFRa6TBZEybFlHejpVwUK0zQvTpeC	1
26	user7179	i1.jpg	\N	\N	\N	2
29	user263	https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=256	\N	\N	\N	2
39	Ben Doe	https://ui-avatars.com/api/?name=Ben%20Doe&background=2563eb&color=fff&size=256	\N	ben@gmail.com	\N	2
40	Tanvi Patidar	"C:\\Users\\sneha\\Downloads\\sample_profile pic.jpg"	\N	tanvi@gmail.com	\N	2
41	Sejal	https://ui-avatars.com/api/?name=Sejal&background=2563eb&color=fff&size=256	\N	sejal@gmail.com	\N	2
25	Jane Hopper	\N	9	jane@gmail.com	$2b$10$8CYllNTZ6Yy1hagFgEJtD.GqiIG8055uwviTVO.IkdA7tx.ipbuZW	2
49	Atharv Sharma	https://ui-avatars.com/api/?name=Atharv%20Sharma&background=2563eb&color=fff&size=256	\N	atharvs@gmail.com	\N	2
\.


--
-- Data for Name: Workspace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Workspace" (id, name, "ownerId", "createdAt") FROM stdin;
1	Snehal Workspace	22	2026-01-24 10:19:58.21
2	Jane Workspace	25	2026-01-24 10:23:55.245
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
05e5eb7b-d86a-4d85-9b76-8410489257b8	50eec1202aff7309ab2818c0fef86f30f7ad465fea54047c15fd9eb95e0ad5f4	2026-01-16 19:26:02.321392+05:30	20260104150837_init	\N	\N	2026-01-16 19:26:02.234405+05:30	1
33f7cef8-60f8-467c-9cba-1e40565cf0c3	ad282e7b73ec382e64ac8cf8123d34d39663ceca9d78a336278cb30f09cda1ad	2026-01-16 19:26:02.331772+05:30	20260110112241_add_auth_fields	\N	\N	2026-01-16 19:26:02.322609+05:30	1
b7e5f48f-6816-445d-90a2-57f2371fcb46	4a82884ca91fe9c9e3771419c68a89c872d4b10436348d947011304f5e10bd71	2026-01-16 19:26:02.336153+05:30	20260113194350_add_user_image	\N	\N	2026-01-16 19:26:02.332605+05:30	1
84baff2a-c0b1-4211-b311-0ae6d601ed3e	96beaba8ff845aba763d84858ce0f7bdcfc48e6618a75769227ae201eeba7c8a	2026-01-16 19:26:02.346941+05:30	20260114174759_add_owner_to_project_task_nullable	\N	\N	2026-01-16 19:26:02.33714+05:30	1
64f83792-f5eb-447a-9fed-e3bb20641061	31979c779461cd42cd815eda6f3bc7841e23331b39f6a2decd86f2c5f1e7f934	2026-01-16 19:26:02.35268+05:30	20260115171502_add_owner_to_team	\N	\N	2026-01-16 19:26:02.347697+05:30	1
b58cf86b-63c4-4334-ad86-1060d8224e64	87cdf8f3f853c002949124ad4023ac4c94fbfb9a05b9cd304d4d03ae9f32dd5d	2026-01-16 19:26:02.356936+05:30	20260115180224_fix_team_ownership_model	\N	\N	2026-01-16 19:26:02.35368+05:30	1
05b08c1f-1dc7-45e8-af87-92eb54db7710	1106d5641029131032519ca104382921ed1340f01814fc9b2ca49bd1c0141886	2026-01-16 22:04:22.43007+05:30	20260116163422_add_workspace_and_onboarding	\N	\N	2026-01-16 22:04:22.397067+05:30	1
c931b048-c75e-4b4d-845e-90215bd0a837	c24e939f40d18c1f0aee803666249884f3b2df2a9bf3ff379e565d26768da931	2026-01-17 12:18:27.161675+05:30	20260117064827_add_project_status_and_timestamps	\N	\N	2026-01-17 12:18:27.149969+05:30	1
cafa70a1-0ac5-4cfa-a1d4-3e31e780bef8	219bd104824cf11b67f6853a4e48d9b093c2123695ea0fb1240ff1734f3c35a1	2026-01-17 13:36:30.540212+05:30	20260117080630_add_project_members	\N	\N	2026-01-17 13:36:30.508943+05:30	1
d567f338-6747-4c0b-a8f3-fdb8c87aefac	092f4810b50fe66f18d4e5abdb7781400bf92982cfc4aae2a9575bd8c7258749	2026-01-25 01:17:49.391336+05:30	20260124194749_fix_attachment_id	\N	\N	2026-01-25 01:17:49.292257+05:30	1
603bdfdc-2e23-4fc1-8b8d-7cccc8f3fefc	00b1e3de2835ef19cf534b33de7a4e497ada6054ce783a8637f6415ec8d05047	2026-01-31 23:57:13.20487+05:30	20260131182713_add_invites	\N	\N	2026-01-31 23:57:13.108145+05:30	1
8a25b405-f802-4260-a5a4-65728af5381c	b229969be8181e2f7b3eaa733f0d6d934499e723961e92fb44191e165c4b754d	2026-02-01 00:15:31.552605+05:30	20260131184531_add_invites	\N	\N	2026-02-01 00:15:31.519132+05:30	1
bd1f3b79-4639-46f0-8647-af3928323de6	852ea6f55ce5677abeea3e70c45028df8163be7e02ca4acc273c0e0feaa5d001	2026-02-02 01:13:02.932902+05:30	20260201194302_fix_project_team_relation	\N	\N	2026-02-02 01:13:02.91556+05:30	1
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 1, false);


--
-- Name: ProjectMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProjectMember_id_seq"', 11, true);


--
-- Name: ProjectTeam_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProjectTeam_id_seq"', 20, true);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 20, true);


--
-- Name: TaskAssignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TaskAssignment_id_seq"', 1, false);


--
-- Name: Task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Task_id_seq"', 67, true);


--
-- Name: Team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Team_id_seq"', 9, true);


--
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_userId_seq"', 49, true);


--
-- Name: Workspace_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Workspace_id_seq"', 2, true);


--
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Invite Invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "Invite_pkey" PRIMARY KEY (id);


--
-- Name: ProjectMember ProjectMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_pkey" PRIMARY KEY (id);


--
-- Name: ProjectTeam ProjectTeam_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTeam"
    ADD CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: TaskAssignment TaskAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskAssignment"
    ADD CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");


--
-- Name: Workspace Workspace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workspace"
    ADD CONSTRAINT "Workspace_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Invite_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invite_token_key" ON public."Invite" USING btree (token);


--
-- Name: ProjectMember_projectId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON public."ProjectMember" USING btree ("projectId", "userId");


--
-- Name: ProjectTeam_projectId_teamId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectTeam_projectId_teamId_key" ON public."ProjectTeam" USING btree ("projectId", "teamId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Attachment Attachment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attachment Attachment_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invite Invite_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "Invite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invite Invite_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "Invite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProjectMember ProjectMember_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectMember ProjectMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectMember"
    ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectTeam ProjectTeam_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTeam"
    ADD CONSTRAINT "ProjectTeam_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectTeam ProjectTeam_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTeam"
    ADD CONSTRAINT "ProjectTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Project Project_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public."Workspace"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TaskAssignment TaskAssignment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskAssignment"
    ADD CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TaskAssignment TaskAssignment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TaskAssignment"
    ADD CONSTRAINT "TaskAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Task Task_authorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Task Task_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public."Workspace"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Team Team_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Team Team_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public."Workspace"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public."Workspace"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Workspace Workspace_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workspace"
    ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict xwfdaz4d2V5RcFpSMPfsWCd5s3ryU6q3wNyRTWVMebH8X51NBL0H5zEOvuK9w7g

