import Joi from "joi";

import { emailRegExp } from "../models/contacts/User.js";

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(4).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(4).required(),
});
