import { HttpErr } from "../helpers/HttpErr.js";

export const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(HttpErr(400, error.message));
    }
    next();
  };
  return func;
};
