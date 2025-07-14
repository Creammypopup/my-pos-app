import axios from 'axios';

const API_URL = '/api/sales/';

const createSale = async (saleData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, saleData, config);
  return response.data;
};

const saleService = {
  createSale,
};

export default saleService;
