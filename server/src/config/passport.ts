import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import { prisma } from "../lib/prisma";
// import fetch from "node-fetch";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "http://localhost:8000/auth/google/callback",
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: GoogleProfile,
            done: Function
        ) => {
            const email = profile.emails?.[0]?.value;
            const profilePictureUrl = profile.photos?.[0]?.value || null;

            if (!email) {
                return done(new Error("Google account has no email"));
            }

            let user = await prisma.user.findFirst({ where: { email } });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        username: profile.displayName,
                        profilePictureUrl,
                    },
                });
            }

            return done(null, user);
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            callbackURL: "http://localhost:8000/auth/github/callback",
            scope: ["user:email"],
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: GitHubProfile,
            done: Function
        ) => {
            let email = profile.emails?.[0]?.value;
            const profilePictureUrl = profile.photos?.[0]?.value || null;

            // If GitHub didn't send email → fetch manually
            if (!email) {
                const res = await fetch("https://api.github.com/user/emails", {
                    headers: {
                        Authorization: `token ${accessToken}`,
                        Accept: "application/vnd.github+json",
                    },
                });

                const emails = await res.json();
                const primary = emails.find((e: any) => e.primary && e.verified);
                email = primary?.email;
            }

            if (!email) {
                return done(new Error("GitHub account has no email"));
            }

            // Now TS knows it's a string
            const safeEmail: string = email;

            let user = await prisma.user.findFirst({
                where: { email: safeEmail },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: safeEmail,
                        username: profile.username || profile.displayName,
                        profilePictureUrl,
                    },
                });
            }

            return done(null, user);

        }
    )
);
