import axios from 'axios';

const API_URL = '/api/sales/';

const createSale = async (saleData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, saleData, config);
  return response.data;
};

const getSales = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
}

// --- ฟังก์ชันใหม่ ---
const addPaymentToSale = async (data, token) => {
    const { saleId, ...paymentData } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}${saleId}/payments`, paymentData, config);
    return response.data;
};
// --------------------

const saleService = {
  createSale,
  getSales,
  addPaymentToSale, // <-- เพิ่ม
};

export default saleService;