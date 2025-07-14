import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roleService from './roleService';

const initialState = {
  roles: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Async Thunks
export const getRoles = createAsyncThunk('roles/getAll', async (_, thunkAPI) => {
  try {
    return await roleService.getRoles();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const createRole = createAsyncThunk('roles/create', async (roleData, thunkAPI) => {
  try {
    return await roleService.createRole(roleData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || error.message);
  }
});

export const updateRole = createAsyncThunk('roles/update', async (roleData, thunkAPI) => {
    try {
      return await roleService.updateRole(roleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteRole = createAsyncThunk('roles/delete', async (roleId, thunkAPI) => {
    try {
      await roleService.deleteRole(roleId);
      return roleId; // Return id to remove from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

// Slice
export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Roles
      .addCase(getRoles.pending, (state) => { state.isLoading = true; })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Role
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      // Update Role
      .addCase(updateRole.fulfilled, (state, action) => {
        state.roles = state.roles.map((role) =>
          role._id === action.payload._id ? action.payload : role
        );
      })
      // Delete Role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role._id !== action.payload);
      })
  },
});

export const { reset } = roleSlice.actions;
export default roleSlice.reducer;
