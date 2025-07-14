import axios from 'axios';

const API_URL = '/api/settings/';

const getSettings = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const updateSettings = async (settingsData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL, settingsData, config);
  return response.data;
};

const settingService = {
  getSettings,
  updateSettings,
};

export default settingService;
