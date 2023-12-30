import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { HttpErr } from "../helpers/HttpErr.js";
import UserModel from "../models/contacts/User.js";

dotenv.config();

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpErr(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpErr(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(id);

    if (!user || !user.token || token !== user.token) {
      return next(HttpErr(401, "Not authorized"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(HttpErr(401, "Not authorized"));
  }
};
