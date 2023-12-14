import express from "express";

import contactsController from "../../controllers/contacts-controller.js";
// import { isEmptyBody } from "../../middleWares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", contactsController.getContactById);

contactsRouter.post("/", contactsController.addContact);

contactsRouter.delete("/:contactId", contactsController.removeContact);

contactsRouter.put("/:contactId", contactsController.updContact);

export default contactsRouter;
