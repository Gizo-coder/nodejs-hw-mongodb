import createHttpError from "http-errors";
import * as contactsService from "../controllers/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.json({
      status: 200,
      message: "Successfully retrieved contacts",
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Successfully retrieved a contact",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.createContact(req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updated = await contactsService.updateContact(contactId, req.body);

    if (!updated) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deleted = await contactsService.deleteContact(contactId);

    if (!deleted) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
