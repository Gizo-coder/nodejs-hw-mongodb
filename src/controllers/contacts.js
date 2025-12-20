import createHttpError from "http-errors";
import * as contactsService from "../services/contacts.js";
import Contact from "../db/models/Contact.js"; 
import cloudinary from "../utils/cloudinary.js";

//Get
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

    const filter = { userId: req.user._id };
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

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

export const getContactByIdController = async (req, res, next) => {
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

// Post
export const addContactController = async (req, res, next) => {
  try {
    const newContact = await contactsService.createContact({ ...req.body, userId: req.user._id });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

//Patch
export const updateContactController = async (req, res, next) => {
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

//Delete
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deleted = await contactsService.deleteContact(contactId);

    if (!deleted) throw createHttpError(404, "Contact not found");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

//post contacts with photo
export const createContactController = async (req, res) => {  
  let photo = null;
  if (req.file) {
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'contacts', }
    );    
    photo = result.secure_url;
  }
  const contact = await Contact.create({...req.body,photo,});

  res.status(201).json({
    status: 201,
    message: 'Contact created successfully',
    data: contact,
  });
};

//patch contacts id
export const updateContactController = async (req, res) => {
  let photo;

  if (req.file) {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'contacts' }
    );
    photo = result.secure_url;
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    { ...req.body, ...(photo && { photo }) },
    { new: true }
  );

  res.json({
    status: 200,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};
