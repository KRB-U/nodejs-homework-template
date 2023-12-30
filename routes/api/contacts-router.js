import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/validateBody.js";
import {
  authenticate,
  isEmptyBody,
  isValidId,
} from "../../middleWares/index.js";

import {
  contactAddScheme,
  contactUpdScheme,
  contactUpdateFavoriteSchema,
} from "../../schemes/contacts-schemes.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsController.getContactById);

contactsRouter.post(
  "/",
  validateBody(contactAddScheme),
  contactsController.addContact
);

contactsRouter.delete(
  "/:contactId",
  isValidId,
  contactsController.removeContact
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  validateBody(contactUpdScheme),
  contactsController.updContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  // isEmptyFavorite,
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);
export default contactsRouter;
