import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarExpanded: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    // Action ใหม่: สั่งให้ Sidebar ขยายตัวโดยเฉพาะ
    expandSidebar: (state) => {
      state.isSidebarExpanded = true;
    },
  },
});

export const { toggleSidebar, expandSidebar } = uiSlice.actions;
export default uiSlice.reducer;
