import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import saleService from './saleService';

const initialState = {
  sales: [],
  lastCreatedSale: null, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createSale = createAsyncThunk('sales/create', async (saleData, thunkAPI) => {
    // ... (เหมือนเดิม)
});

export const getSales = createAsyncThunk('sales/getAll', async (_, thunkAPI) => {
    // ... (เหมือนเดิม)
});

// --- Thunk ใหม่ ---
export const addPaymentToSale = createAsyncThunk('sales/addPayment', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await saleService.addPaymentToSale(data, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
// --------------------

export const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    reset: (state) => {
        // ... (เหมือนเดิม)
    }
  },
  extraReducers: (builder) => {
    builder
      // ... (cases for createSale, getSales)
      // --- Cases ใหม่ ---
      .addCase(addPaymentToSale.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(addPaymentToSale.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          const index = state.sales.findIndex(s => s._id === action.payload._id);
          if (index !== -1) {
              state.sales[index] = action.payload;
          }
      })
      .addCase(addPaymentToSale.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      });
      // --------------------
  },
});

export const { reset } = saleSlice.actions;
export default saleSlice.reducer;