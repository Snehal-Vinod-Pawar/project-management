"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const prisma_1 = require("../lib/prisma");
// import fetch from "node-fetch";
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c, _d;
    const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    const profilePictureUrl = ((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || null;
    if (!email) {
        return done(new Error("Google account has no email"));
    }
    let user = await prisma_1.prisma.user.findFirst({ where: { email } });
    if (!user) {
        user = await prisma_1.prisma.user.create({
            data: {
                email,
                username: profile.displayName,
                profilePictureUrl,
            },
        });
    }
    return done(null, user);
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
    scope: ["user:email"],
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c, _d;
    let email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    const profilePictureUrl = ((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || null;
    // If GitHub didn't send email → fetch manually
    if (!email) {
        const res = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });
        const emails = await res.json();
        const primary = emails.find((e) => e.primary && e.verified);
        email = primary === null || primary === void 0 ? void 0 : primary.email;
    }
    if (!email) {
        return done(new Error("GitHub account has no email"));
    }
    // Now TS knows it's a string
    const safeEmail = email;
    let user = await prisma_1.prisma.user.findFirst({
        where: { email: safeEmail },
    });
    if (!user) {
        user = await prisma_1.prisma.user.create({
            data: {
                email: safeEmail,
                username: profile.username || profile.displayName,
                profilePictureUrl,
            },
        });
    }
    return done(null, user);
}));
