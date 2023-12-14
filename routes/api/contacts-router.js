import express from "express";

import Joi from "joi";

import contactsController from "../../controllers/contacts-controller.js";

const contactsRouter = express.Router();

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", contactsController.getContactsById);

contactsRouter.post("/", contactsController.addContact);

contactsRouter.delete("/:contactId", contactsController.deletingContact);

contactsRouter.put("/:contactId", contactsController.updContact);

export default contactsRouter;
