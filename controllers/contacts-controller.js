import { HttpErr } from "../helpers/HttpErr.js";

import Contact from "../models/contacts/Contact.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 10, favorite = false } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };

  if (favorite) {
    query.favorite = favorite;
  }

  const result = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");

  const count = await Contact.countDocuments(query);

  res.json({
    contacts: result,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  });
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const addNewContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(addNewContact);
};

const getContactById = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;

  const oneContact = await Contact.findOne({ _id, owner });
  // const oneContact = await Contact.findById(contactId);

  if (!oneContact) {
    throw HttpErr(404, `contacts with ID ${_id} not found`); //return
  }

  res.json(oneContact);
};

const removeContact = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id, owner });

  // const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw HttpErr(404, "not found");
  }

  res.json({ message: "contact deleted" });
};

const updContact = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);

  // const result = await Contact.findByIdAndUpdate(contactId, req.body);
  //
  if (!result) {
    throw HttpErr(404, "not found");
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);

  // const result = await Contact.findByIdAndUpdate(contactId, req.body);

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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
