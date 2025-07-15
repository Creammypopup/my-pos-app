import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { getMe, stopAuthLoading } from './features/auth/authSlice';

import PrivateRoute from './components/PrivateRoute';
import PermissionRoute from './components/PermissionRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import ContactsPage from './pages/ContactsPage';
import SettingsLayout from './pages/SettingsLayout';
import GeneralPage from './pages/settings/GeneralPage';
import UsersPage from './pages/settings/UsersPage';
import RolesPage from './pages/settings/RolesPage';
import ThemePage from './pages/settings/ThemePage';
import PlaceholderPage from './components/PlaceholderPage';
import SalesHistoryPage from './pages/SalesHistoryPage';

import {
  FaFileSignature, FaFileInvoice, FaReceipt, FaShoppingCart, FaWallet,
  FaBox, FaUserTie, FaMoneyCheckAlt, FaBook, FaChartPie,
  FaWarehouse, FaTools, FaChartBar, FaCalendarAlt
} from 'react-icons/fa';

const MainLayout = ({ children }) => (
  <div className='flex h-screen bg-bg-main'>
    <Sidebar />
    <div className='flex-1 flex flex-col overflow-hidden'>
      <Header />
      <main className='flex-1 overflow-y-auto p-4 md:p-6'>
        {children}
      </main>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { user, isAuthLoading } = useSelector(state => state.auth);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch(getMe());
    } else {
      dispatch(stopAuthLoading());
    }
  }, [dispatch]);

  if (isAuthLoading) {
    return <div>Loading Application...</div>;
  }
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout><PermissionRoute permission="dashboard-view"><Dashboard /></PermissionRoute></MainLayout>} />
            <Route path="/pos" element={<MainLayout><PermissionRoute permission="pos-access"><PosPage /></PermissionRoute></MainLayout>} />
            
            <Route path="/sales-history" element={<MainLayout><PermissionRoute permission="sales-docs-view"><SalesHistoryPage /></PermissionRoute></MainLayout>} />
            <Route path="/quotations" element={<MainLayout><PermissionRoute permission="quotations-manage"><PlaceholderPage title="ใบเสนอราคา" icon={<FaFileSignature />} /></PermissionRoute></MainLayout>} />
            <Route path="/invoices" element={<MainLayout><PermissionRoute permission="invoices-manage"><PlaceholderPage title="ใบแจ้งหนี้/ใบกำกับ" icon={<FaFileInvoice />} /></PermissionRoute></MainLayout>} />
            <Route path="/receipts" element={<MainLayout><PermissionRoute permission="receipts-manage"><PlaceholderPage title="ใบเสร็จรับเงิน" icon={<FaReceipt />} /></PermissionRoute></MainLayout>} />

            <Route path="/purchase-orders" element={<MainLayout><PermissionRoute permission="purchase-orders-manage"><PlaceholderPage title="ใบสั่งซื้อ" icon={<FaShoppingCart />} /></PermissionRoute></MainLayout>} />
            <Route path="/expenses" element={<MainLayout><PermissionRoute permission="expenses-manage"><PlaceholderPage title="บันทึกค่าใช้จ่าย" icon={<FaWallet />} /></PermissionRoute></MainLayout>} />
            <Route path="/bills" element={<MainLayout><PermissionRoute permission="purchase-docs-view"><PlaceholderPage title="ใบรับสินค้า" icon={<FaBox />} /></PermissionRoute></MainLayout>} />
            
            <Route path="/products" element={<MainLayout><PermissionRoute permission="products-view"><ProductsPage /></PermissionRoute></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><PermissionRoute permission="stock-adjustments-manage"><PlaceholderPage title="ภาพรวมคลังสินค้า" icon={<FaWarehouse />} /></PermissionRoute></MainLayout>} />
            <Route path="/stock-adjustments" element={<MainLayout><PermissionRoute permission="stock-adjustments-manage"><PlaceholderPage title="ปรับสต็อก" icon={<FaTools />} /></PermissionRoute></MainLayout>} />

            <Route path="/contacts" element={<MainLayout><PermissionRoute permission="contacts-manage"><ContactsPage /></PermissionRoute></MainLayout>} />
            <Route path="/calendar" element={<MainLayout><PlaceholderPage title="ปฏิทิน" icon={<FaCalendarAlt />} /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><PermissionRoute permission="reports-view"><PlaceholderPage title="รายงาน" icon={<FaChartBar />} /></PermissionRoute></MainLayout>} />

            <Route path="/employees" element={<MainLayout><PlaceholderPage title="ข้อมูลพนักงาน" icon={<FaUserTie />} /></MainLayout>} />
            <Route path="/payroll" element={<MainLayout><PlaceholderPage title="เงินเดือน" icon={<FaMoneyCheckAlt />} /></MainLayout>} />

            <Route path="/chart-of-accounts" element={<MainLayout><PermissionRoute permission="chart-of-accounts-manage"><PlaceholderPage title="ผังบัญชี" icon={<FaBook />} /></PermissionRoute></MainLayout>} />
            <Route path="/journal" element={<MainLayout><PermissionRoute permission="journal-manage"><PlaceholderPage title="สมุดรายวัน" icon={<FaChartPie />} /></PermissionRoute></MainLayout>} />
            
            <Route path="/settings" element={<MainLayout><PermissionRoute permission="settings-access"><SettingsLayout /></PermissionRoute></MainLayout>}>
              <Route index element={<PermissionRoute permission="general-settings-manage"><GeneralPage /></PermissionRoute>} />
              <Route path="general" element={<PermissionRoute permission="general-settings-manage"><GeneralPage /></PermissionRoute>} />
              <Route path="users" element={<PermissionRoute permission="users-manage"><UsersPage /></PermissionRoute>} />
              <Route path="roles" element={<PermissionRoute permission="roles-manage"><RolesPage /></PermissionRoute>} />
              <Route path="theme" element={<PermissionRoute permission="theme-settings-manage"><ThemePage /></PermissionRoute>} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer autoClose={3000} hideProgressBar theme="colored" position="bottom-right" />
    </>
  );
}

export default App;