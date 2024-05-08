import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatedContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);
    if (!removedContact) {
      throw HttpError(404);
    }
    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  const contact = req.body;
  const createdContact = await addContact(contact);
  if (!createdContact) {
    throw HttpError(400);
  }
  res.status(201).json(createdContact);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changeContact = await updatedContact(id, req.body);
    if (!changeContact) {
      throw HttpError(404);
    }
    res.json(changeContact);
  } catch (error) {
    next(error);
  }
};
