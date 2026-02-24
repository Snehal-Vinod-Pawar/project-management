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

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

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

// app.set("trust proxy", true);
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://project-management-nu3t.vercel.app",
//       "https://project-management-nu3t-git-master-snehal-vinod-pawars-projects.vercel.app"
//     ],
//     credentials: true,
//   })
// );
app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(passport.initialize());
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
console.log("About to start server...");
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT " + PORT);
});