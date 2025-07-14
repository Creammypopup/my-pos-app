import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contactService from './contactService';

const initialState = {
  contacts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createContact = createAsyncThunk('contacts/create', async (contactData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await contactService.createContact(contactData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getContacts = createAsyncThunk('contacts/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await contactService.getContacts(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateContact = createAsyncThunk('contacts/update', async (contactData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contactService.updateContact(contactData._id, contactData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteContact = createAsyncThunk('contacts/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await contactService.deleteContact(id, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContact.pending, (state) => { state.isLoading = true; })
      .addCase(createContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contacts.push(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContacts.pending, (state) => { state.isLoading = true; })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contacts = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contacts = state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        );
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contacts = state.contacts.filter((contact) => contact._id !== action.payload.id);
      });
  },
});

export const { reset } = contactSlice.actions;
export default contactSlice.reducer;
