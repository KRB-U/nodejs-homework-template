import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/validateBody.js";
import {
  contactAddScheme,
  contactUpdScheme,
} from "../../schemes/contacts-schemes.js";

// import { isEmptyBody } from "../../middleWares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

// contactsRouter.get("/:contactId", contactsController.getContactById);

contactsRouter.post(
  "/",
  validateBody(contactAddScheme),
  contactsController.addContact
);

// contactsRouter.delete("/:contactId", contactsController.removeContact);

contactsRouter.put(
  "/:contactId",
  validateBody(contactUpdScheme),
  contactsController.updContact
);

export default contactsRouter;
