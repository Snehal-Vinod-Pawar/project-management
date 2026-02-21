import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// helper function
const createToken = (userId: number) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ================= REGISTER =================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // CREATE WORKSPACE FOR USER
    const workspace = await prisma.workspace.create({
      data: {
        name: `${user.username}'s Workspace`,
        ownerId: user.userId,
        members: {
          connect: { userId: user.userId },
        },
      },
    });

    // LINK USER TO WORKSPACE
    await prisma.user.update({
      where: { userId: user.userId },
      data: { workspaceId: workspace.id },
    });

    // AUTO LOGIN
    const token = createToken(user.userId);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Registered & logged in successfully",
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};


// ================= LOGIN =================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.userId);
    setAuthCookie(res, token);

    return res.json({
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= LOGOUT =================
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// ================= GET ME =================
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: {
        userId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
      },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    return res.json({
      id: user.userId,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= OAUTH SUCCESS (Google / GitHub) =================
export const oauthSuccess = (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const token = createToken(user.userId);
    setAuthCookie(res, token);

    return res.redirect("http://localhost:3000/");
  } catch (error) {
    return res.redirect("http://localhost:3000/login?error=oauth_failed");
  }
};
