import { HttpErr } from "../helpers/HttpErr.js";
import contactsService from "../services/services.js";
import {
  contactAddScheme,
  contactUpdScheme,
} from "../schemes/contacts-schemes.js";

const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await contactsService.getContactById(contactId);

    if (!oneContact) {
      throw HttpErr(404, `contacts with ID ${contactId} not found`); //return
    }

    res.json(oneContact);
  } catch (err) {
    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactAddScheme.validate(req.body);

    if (error) {
      throw HttpErr(400, error.message);
    }

    const addNewContact = await contactsService.addContact(req.body);

    res.status(201).json(addNewContact);
  } catch (err) {
    next(err);
  }
  // res.json();
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await contactsService.removeContact(contactId);

    if (!result) {
      throw HttpErr(404, "not found");
    }

    res.json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
  res.json({ message: "template message" });
};

const updContact = async (req, res, next) => {
  try {
    const { error } = contactUpdScheme.validate(req.body);

    if (error) {
      throw HttpErr(400, error.message);
    }

    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);

    if (!result) {
      throw HttpErr(404, "not found");
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updContact,
};
