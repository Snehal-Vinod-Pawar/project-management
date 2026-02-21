import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import authRoutes from "./routes/authRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import inviteRoutes from "./routes/inviteRoutes"

import path from "path";

import passport from "passport";
import "./config/passport";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(passport.initialize());
// app.use("/uploads", express.static("public/uploads"));
app.use("/api", inviteRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);


/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/auth", authRoutes);
app.use("/auth", oauthRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
  console.log(`Server running on part ${port}`);
});