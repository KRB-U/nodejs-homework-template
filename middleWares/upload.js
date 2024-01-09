import multer from "multer";
import path from "path";
// import { HttpErr } from "../helpers/HttpErr.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,

  filename: (req, file, callback) => {
    callback(null, file.originalname);
    // const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    // callback(null, uniqueSuffix + "_" + file.originalname);
  },
});

const limits = {
  fileSize: 5e6,
};

// function fileFilter(req, file, callback) {
//   const extention = req.originalname.split(".").pop();
//   if (extention === "exe") {
//     callback(HttpErr(400, "not valid extension"));
//   }
// }

export const upload = multer({
  storage,
  limits,
});
