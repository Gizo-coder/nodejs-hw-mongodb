import Contact from '../db/models/Contact.js';


export const getAllContacts = async (filter) => {
  return await Contact.find(filter);
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, userId, data) => {
  return await Contact.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};
