import express from "express";

import contactsService from "../../models/contacts/index.js";
import HttpErr from "../../helpers/HttpErr.js";
import Joi from "joi";

// console.log(contactsService);

const contactsRouter = express.Router();

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

contactsRouter.get("/", async (req, res, next) => {
  console.log(res);
  try {
    const result = await contactsService.listContacts();

    res.json(result);
  } catch (err) {
    next(err);
  }
});

contactsRouter.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await contactsService.getContactById(contactId);

    if (!oneContact) {
      throw HttpErr(404, "not found");
    }

    res.json(oneContact);
  } catch (err) {
    next(err);
  }
});

contactsRouter.post("/", async (req, res, next) => {
  try {
    // console.log(req);
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw HttpErr(400, error.message);
    }

    const addNewContact = await contactsService.addContact(req.body);
    res.status(201).json(addNewContact);
  } catch (err) {
    next(err);
  }
  res.json();
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await contactsService.removeContact(contactId);

    if (!result) {
      throw HttpError(404, "not found");
    }

    res.json({ message: "success" });
  } catch (err) {}
  res.json({ message: "template message" });
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw HttpErr(400, error.message);
    }

    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);

    if (!result) {
      throw HttpError(404, "not found");
    }

    res.join(result);
  } catch (err) {
    next(err);
  }

  res.json({ message: "template message" });
});

export default contactsRouter;
