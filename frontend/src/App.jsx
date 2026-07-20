// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import DashboardLayout from './layouts/DashboardLayout';
// import Dashboard from './pages/Dashboard';
// import Users from './pages/Users';
// import Customers from './pages/Customers';
// import AddCustomer from './pages/AddCustomer';
// import Products from './pages/Products';
// import Contracts from './pages/Contracts';
// import GenerateContract from './pages/GenerateContract';
// import Login from './pages/Login';
// import { AuthProvider } from './components/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import ProformaInvoice from './pages/ProformaInvoice';
// import ProformaInvoiceGenerate from './pages/ProformaInvoiceGenerate';
// import TermsOfPayment from './pages/PaymentTerms';
// import { Toaster } from 'react-hot-toast';
// import EditCustomer from './pages/EditCustomer';
// import Invoice from './pages/Invoice';
// import InvoiceGenerate from './pages/GenerateInvoice';
// import ShippingDetails from './pages/ShippingDetails';
// import ShipmentTrackingForm from './pages/ShippingTracking';
// import CustomSaleDetails from './pages/CustomSaleDetails';
// import BankSaleDetails from './pages/BankSale';
// import MainInvoice from './pages/MainInvoice';

// function App() {
//   return (

//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route element={<ProtectedRoute />}>
//             <Route element={<DashboardLayout />}>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/users" element={<Users />} />
//               <Route path="/customers" element={<Customers />} />
//               <Route path="/customers/add" element={<AddCustomer />} />
//               <Route path="/customers/edit/:id" element={<EditCustomer />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/contracts" element={<Contracts />} />
//               <Route path="/contracts/generate" element={<GenerateContract />} />
//               <Route path="/settings" element={<div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-400">Settings Page Under Construction</div>} />
//               <Route path="/proformainvoice" element={<ProformaInvoice />} />
//               <Route path="/proformainvoice/generate" element={<ProformaInvoiceGenerate />} />
//               <Route path='/invoice/generate' element={<InvoiceGenerate />} />
//               <Route path='/invoice' element={<Invoice />} />
//               {/*<Route path='/invoice/shipping-details' element={<ShippingDetails/>}/>
//               <Route path='/invoice/shipping-tracking' element={<ShipmentTrackingForm/>}/>
//               <Route path='/invoice/custom-sale' element={<CustomSaleDetails/>}/>
//               <Route path='/invoice/bank-sale' element={<BankSaleDetails/>}/> */}

//               <Route path="/payment-terms" element={<TermsOfPayment />} />
//               <Route path="/maininvoice/:id" element={<MainInvoice />} />

//             </Route>
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;




import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import PageLoader from "./components/PageLoader";
import Demo from "./components/AddProduct";

// Lazy Loaded Pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Customers = lazy(() => import("./pages/Customers"));
const AddCustomer = lazy(() => import("./pages/AddCustomer"));
const EditCustomer = lazy(() => import("./pages/EditCustomer"));
const Products = lazy(() => import("./pages/Products"));
const Contracts = lazy(() => import("./pages/Contracts"));
const GenerateContract = lazy(() => import("./pages/GenerateContract"));
const ProformaInvoice = lazy(() => import("./pages/ProformaInvoice"));
const ProformaInvoiceGenerate = lazy(() => import("./pages/ProformaInvoiceGenerate"));
const Invoice = lazy(() => import("./pages/Invoice"));
const InvoiceGenerate = lazy(() => import("./pages/GenerateInvoice"));
const TermsOfPayment = lazy(() => import("./pages/PaymentTerms"));
const MainInvoice = lazy(() => import("./pages/MainInvoice"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/Demo" element={<Demo />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="customers">
                  <Route index element={<Customers />} />
                  <Route path="add" element={<AddCustomer />} />
                  <Route path="edit/:id" element={<EditCustomer />} />
                </Route>
                <Route path="contracts">
                  <Route index element={<Contracts />} />
                  <Route path="generate" element={<GenerateContract />} />
                </Route>
                <Route path="proforma-invoice">
                  <Route index element={<ProformaInvoice />} />
                  <Route path="generate" element={<ProformaInvoiceGenerate />} />
                </Route>
                <Route path="invoice">
                  <Route index element={<Invoice />} />
                  <Route path="generate" element={<InvoiceGenerate />} />
                </Route>
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
                <Route path="payment-terms" element={<TermsOfPayment />} />
                <Route path="maininvoice/:id" element={<MainInvoice />} />
              </Route>
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;