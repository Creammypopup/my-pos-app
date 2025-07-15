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
import ContactsPage from './pages/ContactsPage';
import SettingsLayout from './pages/SettingsLayout';
import GeneralPage from './pages/settings/GeneralPage';
import UsersPage from './pages/settings/UsersPage';
import RolesPage from './pages/settings/RolesPage';
import ThemePage from './pages/settings/ThemePage';
import PlaceholderPage from './components/PlaceholderPage'; // Import หน้า Placeholder
import SalesHistoryPage from './pages/SalesHistoryPage';

// --- Import ไอคอนสำหรับหน้า Placeholder ---
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
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/pos" element={<MainLayout><PosPage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/contacts" element={<MainLayout><ContactsPage /></MainLayout>} />
            
            {/* --- เพิ่ม Routes สำหรับเมนูใหม่ทั้งหมด --- */}
            <Route path="/calendar" element={<MainLayout><PlaceholderPage title="ปฏิทิน" icon={<FaCalendarAlt />} /></MainLayout>} />
            <Route path="/quotations" element={<MainLayout><PlaceholderPage title="ใบเสนอราคา" icon={<FaFileSignature />} /></MainLayout>} />
            <Route path="/invoices" element={<MainLayout><PlaceholderPage title="ใบแจ้งหนี้/ใบกำกับ" icon={<FaFileInvoice />} /></MainLayout>} />
            <Route path="/receipts" element={<MainLayout><PlaceholderPage title="ใบเสร็จรับเงิน" icon={<FaReceipt />} /></MainLayout>} />
            <Route path="/purchase-orders" element={<MainLayout><PlaceholderPage title="ใบสั่งซื้อ" icon={<FaShoppingCart />} /></MainLayout>} />
            <Route path="/expenses" element={<MainLayout><PlaceholderPage title="บันทึกค่าใช้จ่าย" icon={<FaWallet />} /></MainLayout>} />
            <Route path="/bills" element={<MainLayout><PlaceholderPage title="ใบรับสินค้า" icon={<FaBox />} /></MainLayout>} />
            <Route path="/employees" element={<MainLayout><PlaceholderPage title="ข้อมูลพนักงาน" icon={<FaUserTie />} /></MainLayout>} />
            <Route path="/payroll" element={<MainLayout><PlaceholderPage title="เงินเดือน" icon={<FaMoneyCheckAlt />} /></MainLayout>} />
            <Route path="/chart-of-accounts" element={<MainLayout><PlaceholderPage title="ผังบัญชี" icon={<FaBook />} /></MainLayout>} />
            <Route path="/journal" element={<MainLayout><PlaceholderPage title="สมุดรายวัน" icon={<FaChartPie />} /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><PlaceholderPage title="คลังสินค้า" icon={<FaWarehouse />} /></MainLayout>} />
            <Route path="/stock-adjustments" element={<MainLayout><PlaceholderPage title="ปรับสต็อก" icon={<FaTools />} /></MainLayout>} />
            <Route path="/reports" element={<MainLayout><PlaceholderPage title="รายงาน" icon={<FaChartBar />} /></MainLayout>} />
            <Route path="/sales-history" element={<MainLayout><SalesHistoryPage /></MainLayout>} />


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
      <ToastContainer autoClose={3000} hideProgressBar theme="colored" position="bottom-right" />
    </>
  );
}

export default App;
