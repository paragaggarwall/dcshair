import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Products from './pages/Products';
import Contracts from './pages/Contracts';
import GenerateContract from './pages/GenerateContract';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProformaInvoice from './pages/ProformaInvoice';
import ProformaInvoiceGenerate from './pages/ProformaInvoiceGenerate';
import TermsOfPayment from './pages/PaymentTerms';
import { Toaster } from 'react-hot-toast';
import EditCustomer from './pages/EditCustomer';
import Invoice from './pages/Invoice';
import InvoiceGenerate from './pages/GenerateInvoice';
import ShippingDetails from './pages/ShippingDetails';
import ShipmentTrackingForm from './pages/ShippingTracking';
import CustomSaleDetails from './pages/CustomSaleDetails';
import BankSaleDetails from './pages/BankSale';
import MainInvoice from './pages/MainInvoice';

function App() {
  return (

    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/customers/edit/:id" element={<EditCustomer />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts/generate" element={<GenerateContract />} />
              <Route path="/settings" element={<div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-400">Settings Page Under Construction</div>} />
              <Route path="/proformainvoice" element={<ProformaInvoice />} />
              <Route path="/proformainvoice/generate" element={<ProformaInvoiceGenerate />} />
               <Route path='/invoice/generate' element={<InvoiceGenerate />} />
                <Route path='/invoice' element={<Invoice/>}/> 
              {/*<Route path='/invoice/shipping-details' element={<ShippingDetails/>}/>
              <Route path='/invoice/shipping-tracking' element={<ShipmentTrackingForm/>}/>
              <Route path='/invoice/custom-sale' element={<CustomSaleDetails/>}/>
              <Route path='/invoice/bank-sale' element={<BankSaleDetails/>}/> */}

              <Route path="/payment-terms" element={<TermsOfPayment />} />
              <Route path="/maininvoice/:id" element={<MainInvoice/>} />

            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

