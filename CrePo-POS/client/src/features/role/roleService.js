import axios from 'axios';

const API_URL = '/api/roles/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all roles
const getRoles = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

// Create a new role
const createRole = async (roleData) => {
  const response = await axios.post(API_URL, roleData, getConfig());
  return response.data;
};

// Update a role
const updateRole = async (roleData) => {
    const response = await axios.put(API_URL + roleData.id, roleData, getConfig());
    return response.data;
};

// Delete a role
const deleteRole = async (roleId) => {
    const response = await axios.delete(API_URL + roleId, getConfig());
    return response.data;
};

const roleService = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};

export default roleService;
