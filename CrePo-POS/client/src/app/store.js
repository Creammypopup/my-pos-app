import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import roleReducer from '../features/role/roleSlice';
import userReducer from '../features/user/userSlice';
import contactReducer from '../features/contact/contactSlice';
import saleReducer from '../features/sale/saleSlice';
import settingReducer from '../features/setting/settingSlice';
import uiReducer from '../features/ui/uiSlice';
import eventReducer from '../features/event/eventSlice'; // Import event reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    roles: roleReducer,
    users: userReducer,
    contacts: contactReducer,
    sales: saleReducer,
    settings: settingReducer,
    ui: uiReducer,
    events: eventReducer, // Add event reducer
  },
});
