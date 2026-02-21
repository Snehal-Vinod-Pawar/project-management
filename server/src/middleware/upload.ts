import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: "public/uploads/tasks",
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadTaskImage = multer({ storage });
