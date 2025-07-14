import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ExpensesPage from './pages/ExpensesPage';
import QuotationsPage from './pages/QuotationsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import StockAdjustmentsPage from './pages/StockAdjustmentsPage';
import ContactsPage from './pages/ContactsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// สร้าง Component ใหม่เพื่อจัดการ Layout
function MainLayout() {
  const location = useLocation();
  const noLayoutRoutes = ['/login'];

  if (noLayoutRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className='flex h-screen bg-gray-100 font-sans'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Header />
        <main className='flex-1 p-6 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/pos' element={<PosPage />} />
              <Route path='/products' element={<ProductsPage />} />
              <Route path='/sales' element={<SalesHistoryPage />} />
              <Route path='/expenses' element={<ExpensesPage />} />
              <Route path='/quotations' element={<QuotationsPage />} />
              <Route path='/purchase-orders' element={<PurchaseOrdersPage />} />
              <Route path='/stock-adjustments' element={<StockAdjustmentsPage />} />
              <Route path='/contacts' element={<ContactsPage />} />
              <Route path='/reports' element={<ReportsPage />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <>
      <Router>
        <MainLayout />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
