import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerOrderService from './customerOrderService';

const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getCustomerOrders = createAsyncThunk('customerOrders/getAll', async (_, thunkAPI) => {
    try {
        return await customerOrderService.getCustomerOrders();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const updateCustomerOrder = createAsyncThunk('customerOrders/update', async (orderData, thunkAPI) => {
    try {
        return await customerOrderService.updateCustomerOrder(orderData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});


export const customerOrderSlice = createSlice({
  name: 'customerOrders',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerOrders.pending, (state) => { state.isLoading = true; })
      .addCase(getCustomerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(updateCustomerOrder.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orders = state.orders.map(order => order._id === action.payload._id ? action.payload : order);
      })
  },
});

export const { reset } = customerOrderSlice.actions;
export default customerOrderSlice.reducer;