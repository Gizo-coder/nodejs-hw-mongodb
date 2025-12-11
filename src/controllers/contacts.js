import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import Contact from "../models/contact.js";

// GET /contacts (pagination + filtering + sorting)
export const getContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = "name",
      sortOrder = "asc",
      type,
      isFavourite,
    } = req.query;

    const skip = (page - 1) * perPage;

    // Filtre
    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

    // Sıralama
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const totalItems = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(perPage));

    const totalPages = Math.ceil(totalItems / perPage);

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: Number(page) > 1,
        hasNextPage: Number(page) < totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /contacts/:id
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) throw createHttpError(404, "Contact not found");

    res.json({
      status: 200,
      message: "Successfully retrieved a contact",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// POST /contacts
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

// PATCH /contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updated = await contactsService.updateContact(contactId, req.body);

    if (!updated) throw createHttpError(404, "Contact not found");

    res.json({
      status: 200,
      message: "Successfully updated a contact!",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await contactsService.deleteContact(contactId);

    if (!deleted) throw createHttpError(404, "Contact not found");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
