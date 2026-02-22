import { Response } from "express";

export const setAuthCookie = (res: Response, token: string) => {

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none", 
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: ".onrender.com",
  });
};