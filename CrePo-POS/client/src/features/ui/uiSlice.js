import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarExpanded: true, // ค่าเริ่มต้นให้ Sidebar กางออก
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Action สำหรับสลับสถานะ (พับ/กาง)
    toggleSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
