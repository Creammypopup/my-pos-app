import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.js';

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, address, type } = req.body;
  const contact = new Contact({ name, email, phone, address, type });
  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

const updateContact = asyncHandler(async (req, res) => {
  const { name, email, phone, address, type } = req.body;
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.address = address || contact.address;
    contact.type = type || contact.type;
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
