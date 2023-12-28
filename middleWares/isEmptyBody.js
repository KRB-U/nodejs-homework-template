import { HttpErr } from "../helpers/HttpErr.js";

export const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpErr(400, "Body must have fields"));
  }
  next();
};
