import { isValidObjectId } from "mongoose";
import { HttpErr } from "../helpers/HttpErr.js";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(HttpErr(404, `id ${contactId} not valid`));
  }
  next();
};
