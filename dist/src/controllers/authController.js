"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthSuccess = exports.getMe = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
// helper function
const createToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (https)
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
// ================= REGISTER =================
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        // CREATE WORKSPACE FOR USER
        const workspace = await prisma_1.prisma.workspace.create({
            data: {
                name: `${user.username}'s Workspace`,
                ownerId: user.userId,
                members: {
                    connect: { userId: user.userId },
                },
            },
        });
        // LINK USER TO WORKSPACE
        await prisma_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
};
exports.registerUser = registerUser;
// ================= LOGIN =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const user = await prisma_1.prisma.user.findFirst({
            where: { email },
        });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.loginUser = loginUser;
// ================= LOGOUT =================
const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
// ================= GET ME =================
const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ message: "Not authenticated" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { userId: decoded.userId },
            select: {
                userId: true,
                username: true,
                email: true,
                profilePictureUrl: true,
            },
        });
        if (!user)
            return res.status(401).json({ message: "User not found" });
        return res.json({
            id: user.userId,
            username: user.username,
            email: user.email,
        });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.getMe = getMe;
// ================= OAUTH SUCCESS (Google / GitHub) =================
const oauthSuccess = (req, res) => {
    try {
        const user = req.user;
        const token = createToken(user.userId);
        setAuthCookie(res, token);
        return res.redirect("http://localhost:3000/");
    }
    catch (error) {
        return res.redirect("http://localhost:3000/login?error=oauth_failed");
    }
};
exports.oauthSuccess = oauthSuccess;
