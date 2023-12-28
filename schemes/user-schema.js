import Joi from "joi";

import { emailRegExp } from "../models/contacts/User.js";

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.empty": "email не повинен бути порожнім",
    "any.required": "missed required email field",
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "password не повинен бути порожнім",
    "any.required": "missed required password field",
  }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.empty": "email не повинен бути порожнім",
    "any.required": "missed required email field",
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "password не повинен бути порожнім",
    "any.required": "missed required password field",
  }),
});
