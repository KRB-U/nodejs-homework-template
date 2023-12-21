import mongoose from "mongoose";
import app from "./app.js";

// const DB_HOST =
//   "mongodb+srv://qwe:r1T6QXqsoBOdvv3j@cluster0.tsxivj7.mongodb.net/db-contacts?";

// const DB_HOST =
//   "mongodb+srv://user-test:xzHmucx8gbL7wmC7@cluster0.tkmkwho.mongodb.net/db-contacts?retryWrites=true&w=majority";

// console.log(process.env.DB_HOST);
const { DB_HOST, PORT = 3002 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
