import { HttpErr } from "../helpers/HttpErr.js";

import Contact from "../models/contacts/Contact.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
  const result = await Contact.find();

  res.json(result);
};

const addContact = async (req, res) => {
  const addNewContact = await Contact.create(req.body);

  res.status(201).json(addNewContact);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const oneContact = await Contact.findById(contactId);

  if (!oneContact) {
    throw HttpErr(404, `contacts with ID ${contactId} not found`); //return
  }

  res.json(oneContact);
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw HttpErr(404, "not found");
  }

  res.json({ message: "contact deleted" });
};

const updContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);

  if (!result) {
    throw HttpErr(404, "not found");
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updContact: ctrlWrapper(updContact),
};
