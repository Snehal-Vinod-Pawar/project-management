// import multer from "multer";
// import { Request } from "express";

// const storage = multer.diskStorage({
//   destination: "public/uploads/tasks",
//   filename: (req: Request, file: any, cb) => {  
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// export const uploadTaskImage = multer({ storage });




import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(__dirname, "../../public/uploads/tasks");

// ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadTaskImage = multer({ storage });
