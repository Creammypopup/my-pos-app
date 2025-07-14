import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  permissions: user?.role?.permissions || [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isAuthLoading: true, // Start as true to check for existing user
  message: '',
};

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try { return await authService.register(userData); } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message || error.message); }
});
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try { return await authService.login(userData); } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message || error.message); }
});
export const logout = createAsyncThunk('auth/logout', async () => { await authService.logout(); });

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        return await authService.getMe();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue(message);
    }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
    },
    stopAuthLoading: (state) => {
        state.isAuthLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.permissions = action.payload?.role?.permissions || [];
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.permissions = [];
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
        state.isAuthLoading = false;
      })
      .addCase(getMe.pending, (state) => { state.isAuthLoading = true; })
      .addCase(getMe.fulfilled, (state, action) => {
          state.isAuthLoading = false;
          state.user = action.payload;
          state.permissions = action.payload?.role?.permissions || [];
      })
      .addCase(getMe.rejected, (state, action) => {
          state.isAuthLoading = false;
          state.user = null;
          state.permissions = [];
      });
  },
});

export const { reset, stopAuthLoading } = authSlice.actions;
export default authSlice.reducer;
