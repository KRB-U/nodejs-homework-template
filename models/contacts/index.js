import fs from "fs/promises";
import { nanoid } from "nanoid";

import path from "path";

export const contactsPath = path.resolve("models", "contacts", "contacts.json");

const listContacts = async () => {
  const list = await fs.readFile(contactsPath);
  return JSON.parse(list);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contId = contacts.find((contact) => contact.id === contactId);
  return contId || null;
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const idx = allContacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const [result] = allContacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  console.log(result);
  return result;
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  console.log(newContact);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  // contacts[index] = { contactId, ...body };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
