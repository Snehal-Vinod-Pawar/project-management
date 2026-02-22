import { Response } from "express";

export const setAuthCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,                 // true only on render
    sameSite: isProd ? "none" : "lax", 
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};