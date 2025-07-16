import axios from 'axios';

const API_URL = '/api/events/';

// Create new event
const createEvent = async (eventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, eventData, config);
  return response.data;
};

// Get user events
const getEvents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update user event
const updateEvent = async (eventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + eventData._id, eventData, config);
  return response.data;
};

// Delete user event
const deleteEvent = async (eventId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + eventId, config);
  return response.data;
};

const eventService = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
};

export default eventService;
