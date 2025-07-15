import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ContactsPage from './pages/ContactsPage';
import SettingsLayout from './pages/SettingsLayout'; // Layout ใหม่สำหรับหน้าตั้งค่า
import GeneralPage from './pages/settings/GeneralPage';
import UsersPage from './pages/settings/UsersPage';
import RolesPage from './pages/settings/RolesPage';
import ThemePage from './pages/settings/ThemePage';

// Layout หลักของแอปพลิเคชัน (เมื่อ Login แล้ว)
const MainLayout = ({ children }) => (
  <div className='flex h-screen bg-bg-main'>
    <Sidebar />
    <div className='flex-1 flex flex-col overflow-hidden'>
      <Header />
      <main className='flex-1 overflow-y-auto p-6 md:p-8'>
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* หน้า Login จะไม่มี Layout อื่นๆ */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes ที่ต้อง Login ก่อนเข้าใช้งาน */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/pos" element={<MainLayout><PosPage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/sales" element={<MainLayout><SalesHistoryPage /></MainLayout>} />
            <Route path="/contacts" element={<MainLayout><ContactsPage /></MainLayout>} />
            
            {/* Nested Routes สำหรับหน้าตั้งค่า */}
            <Route path="/settings" element={<MainLayout><SettingsLayout /></MainLayout>}>
              <Route index element={<GeneralPage />} />
              <Route path="general" element={<GeneralPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="theme" element={<ThemePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer autoClose={3000} hideProgressBar theme="colored" />
    </>
  );
}

export default App;