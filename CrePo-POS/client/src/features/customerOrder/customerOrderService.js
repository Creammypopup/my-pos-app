import axios from 'axios';

const API_URL = '/api/customer-orders/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

const getCustomerOrders = async () => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const updateCustomerOrder = async (orderData) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  const { id, ...updateData } = orderData;
  const response = await axios.put(API_URL + id, updateData, config);
  return response.data;
};


const customerOrderService = {
  getCustomerOrders,
  updateCustomerOrder,
};

export default customerOrderService;