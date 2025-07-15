import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.createProduct(productData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.getProducts(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const updateProduct = createAsyncThunk('products/update', async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.updateProduct(productData._id, productData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await productService.deleteProduct(id, token);
      return id; // ส่ง ID กลับไปเพื่อใช้ลบ state ใน client
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // action.payload คือ id ของสินค้าที่ถูกลบ
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;