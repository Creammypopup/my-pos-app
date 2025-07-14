import axios from 'axios';

const API_URL = '/api/contacts/';

const createContact = async (contactData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, contactData, config);
  return response.data;
};

const getContacts = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const updateContact = async (id, contactData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + id, contactData, config);
    return response.data;
}

const deleteContact = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const contactService = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
};

export default contactService;
