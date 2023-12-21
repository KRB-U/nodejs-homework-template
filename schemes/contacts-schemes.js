import Joi from "joi";
import { phoneType } from "../models/contacts/Contact.js";

export const contactAddScheme = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `missing required email field`,
  }),
  phone: Joi.string().required().pattern(phoneType).messages({
    "any.required": `missing required phone field`,
  }),
  favorite: Joi.boolean(),
});

export const contactUpdScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string().pattern(phoneType),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
