import { HttpErr } from "../helpers/HttpErr.js";

export const isEmptyFavorite = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpErr(400, "missing field favorite"));
  }
  next();
};
