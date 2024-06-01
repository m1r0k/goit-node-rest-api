import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ _id: id, owner: req.user._id });

    if (contact === null) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!removedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const createdContact = await Contact.create({
      ...req.body,
      owner: req.user._id,
    });

    if (!createdContact) {
      throw HttpError(400);
    }

    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changeContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );

    if (!changeContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(changeContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;
    const changeStatusContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      { new: true }
    );

    if (!changeStatusContact) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(changeStatusContact);
  } catch (error) {
    next(error);
  }
};
