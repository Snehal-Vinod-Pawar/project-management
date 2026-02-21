"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const protect = async (req, res, next) => {
    try {
        // 1. Read token from cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        // 2. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3. Fetch user from DB
        const user = await prisma_1.prisma.user.findUnique({
            where: { userId: decoded.userId },
            select: {
                userId: true,
                username: true,
                email: true,
                workspaceId: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // 4. Attach user to request
        req.user = user;
        next(); // allow request to continue
    }
    catch (error) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};
exports.protect = protect;
const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
