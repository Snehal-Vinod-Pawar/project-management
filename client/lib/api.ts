import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // send httpOnly JWT cookie
});
