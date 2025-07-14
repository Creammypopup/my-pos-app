import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingService from './settingService';

const initialState = {
  settings: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getSettings = createAsyncThunk('settings/get', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await settingService.getSettings(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateSettings = createAsyncThunk('settings/update', async (settingsData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await settingService.updateSettings(settingsData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = settingSlice.actions;
export default settingSlice.reducer;