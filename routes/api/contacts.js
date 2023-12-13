import express from "express";

import contactsService from "../../models/contacts/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const responce = await contactsService.listContacts();
  res.json(responce);
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  // console.log(contactId);
  const oneContact = await contactsService.getContactById(contactId);
  res.json(oneContact);
});

export default router;
