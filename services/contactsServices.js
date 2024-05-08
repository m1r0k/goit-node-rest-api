import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

// ...твій код. Повертає масив контактів.
async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

// ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

// ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];
  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(newContacts);
  return removedContact;
}

// ...твій код. Повертає об'єкт доданого контакту (з id).
async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  writeContacts(contacts);
  return newContact;
}

async function updatedContact(contactId, contactData) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  const renewContacts = contacts.filter((contact) => contact.id !== contactId);
  const renewContact = {
    ...contact,
    ...contactData,
  };
  renewContacts.push(renewContact);
  writeContacts(renewContacts);
  return renewContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatedContact,
};
