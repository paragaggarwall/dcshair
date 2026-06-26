

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Plus, Receipt, Search, Loader2, Pencil,
//   Globe, MapPin, Package, CreditCard, Calendar, Hash,
//   Plane, Ship, Train, Truck, CheckCircle2,
//   AlertCircle, DollarSign, RefreshCw, X, CheckCheck, Info,
//   User, FileText, Tag,
//   Download,
//   Eye,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// import InputBox from '../components/InputBox';
// import CustomSelect from '../components/CustomSelect';
// import { useGetMyProformaInvoicesQuery, useProformaDownloadMutation, useProformaPreviewMutation } from './profomainvoice/proformaApiSlice';
// import toast from 'react-hot-toast';


// const TOAST_ICONS = {
//   success: <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />,
//   error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
//   loading: <Loader2 className="w-4 h-4 text-blue-500 shrink-0 animate-spin" />,
//   info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
// };

// const TOAST_STYLES = {
//   success: 'border-emerald-100 bg-emerald-50/80',
//   error: 'border-red-100 bg-red-50/80',
//   loading: 'border-blue-100 bg-blue-50/80',
//   info: 'border-blue-100 bg-blue-50/80',
// };

// function ToastContainer({ toasts, onRemove }) {
//   return (
//     <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-80">
//       <AnimatePresence>
//         {toasts.map((t) => (
//           <motion.div
//             key={t.id}
//             initial={{ opacity: 0, y: 20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.95 }}
//             transition={{ type: 'spring', stiffness: 350, damping: 28 }}
//             className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${TOAST_STYLES[t.type]}`}
//           >
//             {TOAST_ICONS[t.type]}
//             <p className="text-xs font-semibold text-gray-700 flex-1 leading-relaxed">{t.message}</p>
//             <button
//               onClick={() => onRemove(t.id)}
//               className="text-gray-400 hover:text-gray-600 transition mt-0.5 cursor-pointer"
//             >
//               <X className="w-3.5 h-3.5" />
//             </button>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

// function useToast() {
//   const [toasts, setToasts] = useState([]);

//   const add = useCallback((message, type = 'info', duration = 3500) => {
//     const id = Date.now() + Math.random();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     if (type !== 'loading') {
//       setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
//     }
//     return id;
//   }, []);

//   const remove = useCallback((id) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   }, []);

//   const update = useCallback((id, message, type = 'success') => {
//     setToasts((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, message, type } : t))
//     );
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
//   }, []);

//   return { toasts, toast: add, removeToast: remove, updateToast: update };
// }

// const CURRENCY_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

// function formatCurrency(currency = 'USD') {
//   return CURRENCY_SYMBOL[currency] ?? currency;
// }

// function carrierIcon(carrier) {
//   switch (carrier) {
//     case 'AIR': return <Plane className="w-3 h-3 text-sky-500" />;
//     case 'SEA': return <Ship className="w-3 h-3 text-blue-600" />;
//     case 'RAIL': return <Train className="w-3 h-3 text-amber-600" />;
//     default: return <Truck className="w-3 h-3 text-gray-400" />;
//   }
// }

// function LcBadge({ lcNumber }) {
//   if (!lcNumber) return (
//     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-200 uppercase tracking-wide">
//       No LC
//     </span>
//   );
//   return (
//     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wide">
//       <CheckCircle2 className="w-3 h-3" /> LC Attached
//     </span>
//   );
// }


// export default function ProformaInvoice() {
//   const navigate = useNavigate();
//   const { toasts, removeToast, updateToast } = useToast();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCurrency, setSelectedCurrency] = useState('All');
//   const [previewState, setPreviewState] = useState({ open: false, url: null, name: '', loading: false });

//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//     isSuccess,
//   } = useGetMyProformaInvoicesQuery();
//   const proformaInvoices = response?.data ?? [];

//   const [proformaDownload] = useProformaDownloadMutation();
//   const [proformaPreview] = useProformaPreviewMutation();
//   // Toast on fetch state transitions
//   const loadingToastRef = useRef(null);

//   useEffect(() => {
//     if (isFetching && !isLoading) {
//       loadingToastRef.current = toast('Refreshing proforma invoices…', 'loading');
//     }
//     if (!isFetching && loadingToastRef.current) {
//       if (isSuccess) updateToast(loadingToastRef.current, 'Proforma invoices updated', 'success');
//       if (isError) updateToast(loadingToastRef.current, 'Failed to refresh', 'error');
//       loadingToastRef.current = null;
//     }
//   }, [isFetching]);

//   useEffect(() => {
//     if (isError) {
//       toast(
//         error?.data?.message ?? error?.error ?? 'Failed to load proforma invoices',
//         'error',
//         5000
//       );
//     }
//   }, [isError]);

//   // Filters
//   const filtered = proformaInvoices.filter((pi) => {
//     const term = searchTerm.toLowerCase();
//     const matchSearch =
//       pi.proformaInvoiceNo?.toLowerCase().includes(term) ||
//       pi.customer?.name?.toLowerCase().includes(term) ||
//       pi.countryOfDestination?.toLowerCase().includes(term) ||
//       pi.portOfLoading?.toLowerCase().includes(term) ||
//       pi.portOfFinalDestination?.toLowerCase().includes(term) ||
//       pi.lcNumber?.toLowerCase().includes(term);
//     const matchCurrency = selectedCurrency === 'All' || pi.currency === selectedCurrency;
//     return matchSearch && matchCurrency;
//   });

//   const currencyOptions = [
//     { id: 'All', name: 'All Currencies' },
//     { id: 'USD', name: 'USD – US Dollar' },
//     { id: 'EUR', name: 'EUR – Euro' },
//     { id: 'GBP', name: 'GBP – Pound' },
//     { id: 'INR', name: 'INR – Rupee' },
//   ];


//   const handleDownload = async (e, proforma) => {
//     console.log("wrfgerfre", proforma);

//     e.stopPropagation();
//     try {
//       const response = await proformaDownload(proforma.id).unwrap();
//       const url = window.URL.createObjectURL(new Blob([response]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `proforma-${proforma.proformaInvoiceNo}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('Download failed:', err);
//       toast.error(err?.data?.message || err?.message || "Failed to download PDF");
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewState.url) window.URL.revokeObjectURL(previewState.url);
//     };
//   }, [previewState.url]);


//   const handlePreview = async (e, proforma) => {
//     e.stopPropagation();
//     setPreviewState({ open: true, url: null, name: proforma.proformaInvoiceNo, loading: true, });
//     try {
//       const blob = await proformaPreview(proforma.id).unwrap();
//       if (!(blob instanceof Blob)) {
//         throw new Error("Invalid PDF response");
//       }
//       const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
//       setPreviewState({ open: true, url: blobUrl, name: proforma.proformaInvoiceNo, loading: false, });
//     } catch (err) {
//       console.error("Preview failed:", err);
//       setPreviewState({ open: false, url: null, name: "", loading: false, });
//       toast.error(err?.data?.message || err?.message || "Failed to load PDF preview");
//     }
//   };


//   const closePreview = () => {
//     if (previewState.url) window.URL.revokeObjectURL(previewState.url);
//     setPreviewState({ open: false, url: null, name: '', loading: false });
//   };

//   return (
//     <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

//       {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
//       <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
//               <Receipt className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
//                 Proforma Invoices
//               </h1>
//               <p className="text-xs text-gray-400 font-medium leading-tight">
//                 Manage and generate export proforma invoices
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => refetch()}
//               disabled={isFetching}
//               className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
//               title="Refresh"
//             >
//               <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
//             </button>
//             <button
//               onClick={() => navigate('/proforma-invoice/generate')}
//               className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2
//                          hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
//             >
//               <Plus className="w-4 h-4" />
//               Proforma Invoice
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ═══ CARD ════════════════════════════════════════════════════════════ */}
//       <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">

//         {/* ─── SEARCH + FILTERS ─────────────────────────────────────────────── */}
//         <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="w-80">
//               <InputBox
//                 inputFor="proforma-search"
//                 placeholder="Search by no, customer, port, country..."
//                 value={searchTerm}
//                 handleChangeFunction={(e) => setSearchTerm(e.target.value)}
//                 icon={<Search size={15} />}
//                 type="text"
//                 autoComplete="off"
//               />
//             </div>
//             <div className="w-48">
//               <CustomSelect
//                 options={currencyOptions}
//                 value={selectedCurrency}
//                 onChange={setSelectedCurrency}
//                 placeholder="All Currencies"
//               />
//             </div>
//           </div>
//           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//             {filtered.length} Total Proformas
//           </span>
//         </div>

//         {/* ─── TABLE ────────────────────────────────────────────────────────── */}
//         <div className="flex-1 overflow-hidden flex flex-col min-h-0">

//           {/* Fixed header */}
//           <table className="w-full text-left border-collapse table-fixed">
//             <colgroup>
//               <col className="w-[22%]" />
//               <col className="w-[16%]" />
//               <col className="w-[20%]" />
//               <col className="w-[18%]" />
//               <col className="w-[14%]" />
//               <col className="w-[10%]" />
//             </colgroup>
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
//                 <th className="px-6 py-3 font-semibold text-left">
//                   <span className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> Proforma No</span>
//                 </th>
//                 <th className="px-6 py-3 font-semibold text-left">
//                   <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Customer</span>
//                 </th>
//                 <th className="px-6 py-3 font-semibold text-left">
//                   <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Route</span>
//                 </th>
//                 <th className="px-6 py-3 font-semibold text-left">
//                   <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> LC / Payment</span>
//                 </th>
//                 <th className="px-6 py-3 font-semibold text-left">
//                   <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date</span>
//                 </th>
//                 <th className="px-6 py-3 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//           </table>

//           {/* Scrollable body */}
//           <div className="flex-1 overflow-y-auto min-h-0">
//             <table className="w-full text-left border-collapse table-fixed">
//               <colgroup>
//                 <col className="w-[22%]" />
//                 <col className="w-[16%]" />
//                 <col className="w-[20%]" />
//                 <col className="w-[18%]" />
//                 <col className="w-[14%]" />
//                 <col className="w-[10%]" />
//               </colgroup>
//               <tbody className="divide-y divide-gray-50">

//                 {isLoading && (
//                   <tr>
//                     <td colSpan="6" className="px-8 py-20 text-center">
//                       <div className="flex flex-col items-center gap-3">
//                         <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//                         <span className="text-gray-400 font-medium text-sm">Loading proforma invoices...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 )}

//                 {isError && !isLoading && (
//                   <tr>
//                     <td colSpan="6" className="px-8 py-20 text-center">
//                       <div className="flex flex-col items-center gap-3">
//                         <Receipt className="w-10 h-10 text-gray-200" />
//                         <span className="text-gray-400 font-medium text-sm">Could not load proforma invoices</span>
//                         <button
//                           onClick={() => refetch()}
//                           className="px-4 py-1.5 text-xs font-semibold bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition"
//                         >
//                           Try Again
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}

//                 {!isLoading && !isError && filtered.length === 0 && (
//                   <tr>
//                     <td colSpan="6" className="px-8 py-20 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <Receipt className="w-10 h-10 text-gray-200" />
//                         <span className="text-gray-400 font-medium text-sm">No proforma invoices found</span>
//                       </div>
//                     </td>
//                   </tr>
//                 )}

//                 {!isLoading && !isError && filtered.map((pi) => (
//                   <tr key={pi.id} className="hover:bg-blue-50/30 transition-colors">

//                     {/* Proforma No */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
//                           <FileText className="w-4 h-4" />
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-bold text-gray-900 truncate">{pi.proformaInvoiceNo}</p>

//                         </div>
//                       </div>
//                     </td>

//                     {/* Customer */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
//                         <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
//                         <span className="truncate">{pi.customer?.name ?? '—'}</span>
//                       </div>
//                       {pi.currency && (
//                         <div className="flex items-center gap-1.5 mt-1">
//                           <DollarSign className="w-3 h-3 text-gray-300 shrink-0" />
//                           <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
//                             {formatCurrency(pi.currency)} {pi.currency}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     {/* Route */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
//                         <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
//                         <span className="text-gray-700 truncate">{pi.countryOfOrigin ?? '—'}</span>
//                         <span className="text-gray-300 shrink-0">→</span>
//                         <span className="text-gray-700 truncate">{pi.countryOfDestination ?? '—'}</span>
//                       </div>
//                       {(pi.portOfLoading || pi.portOfFinalDestination) && (
//                         <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium">
//                           {carrierIcon(pi.preCarriageBy)}
//                           <span className="truncate">{pi.portOfLoading ?? '—'}</span>
//                           <span className="shrink-0">→</span>
//                           <span className="truncate">{pi.portOfFinalDestination ?? '—'}</span>
//                         </div>
//                       )}
//                     </td>

//                     {/* LC / Payment */}
//                     <td className="px-6 py-4">
//                       <LcBadge lcNumber={pi.lcNumber} />
//                       {pi.lcNumber && (
//                         <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 font-medium">
//                           <Hash className="w-3 h-3 text-gray-400 shrink-0" />
//                           <span className="truncate">{pi.lcNumber}</span>
//                         </div>
//                       )}
//                       {pi.invoicepaymentterm && (
//                         <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
//                           <CreditCard className="w-3 h-3 text-gray-400 shrink-0" />
//                           <span className="truncate">{pi.invoicepaymentterm}</span>
//                         </div>
//                       )}
//                     </td>

//                     {/* Date */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
//                         <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
//                         <span className="truncate">
//                           {new Date(pi.proformaInvoiceDate).toLocaleDateString('en-GB', {
//                             day: '2-digit', month: 'short', year: 'numeric',
//                           })}
//                         </span>
//                       </div>
//                       {pi.lcDate && (
//                         <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
//                           <Calendar className="w-3 h-3 text-gray-300 shrink-0" />
//                           <span className="truncate">
//                             LC: {new Date(pi.lcDate).toLocaleDateString('en-GB', {
//                               day: '2-digit', month: 'short', year: 'numeric',
//                             })}
//                           </span>
//                         </div>
//                       )}
//                     </td>

//                     {/* Action */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-end">
//                         <button
//                           onClick={(e) => handlePreview(e, pi)}
//                           className="p-2 hover:bg-blue-50 rounded-lg text-[#003366] transition-all active:scale-90 cursor-pointer"
//                           title="Preview PDF"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={(e) => handleDownload(e, pi)}
//                           className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all active:scale-90 cursor-pointer"
//                           title="Edit Proforma Invoice"
//                         >
//                           <Download className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>

//                   </tr>
//                 ))}

//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ═══ TOASTS ══════════════════════════════════════════════════════════ */}
//       <ToastContainer toasts={toasts} onRemove={removeToast} />



//       <AnimatePresence>
//         {previewState.open && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closePreview}
//               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//               className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-[#003366] rounded-lg">
//                     <FileText className="w-4 h-4 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-gray-900">{previewState.name}</h2>
//                     <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Contract PDF Preview</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={closePreview}
//                   className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* PDF Viewer */}
//               <div className="flex-1 bg-gray-100 overflow-hidden">
//                 {previewState.loading ? (
//                   <div className="w-full h-full flex flex-col items-center justify-center gap-4">
//                     <Loader2 className="w-10 h-10 animate-spin text-[#003366]" />
//                     <p className="text-sm font-semibold text-gray-500">Generating PDF...</p>
//                   </div>
//                 ) : (
//                   <iframe
//                     src={previewState.url}
//                     className="w-full h-full border-0"
//                     title="Contract PDF Preview"
//                   />
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Receipt, Search, Loader2, Globe, MapPin,
  CreditCard, Calendar, Hash, Plane, Ship, Train,
  Truck, CheckCircle2, DollarSign, RefreshCw, X,
  User, FileText, Tag, Download, Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import InputBox from '../components/InputBox';
import CustomSelect from '../components/CustomSelect';
import {
  useGetMyProformaInvoicesQuery,
  useProformaDownloadMutation,
  useProformaPreviewMutation,
} from './profomainvoice/proformaApiSlice';


const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

const CURRENCY_OPTIONS = [
  { id: 'All', name: 'All Currencies' },
  { id: 'USD', name: 'USD – US Dollar' },
  { id: 'EUR', name: 'EUR – Euro' },
  { id: 'GBP', name: 'GBP – Pound' },
  { id: 'INR', name: 'INR – Rupee' },
];

function getCurrencySymbol(currency = 'USD') {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function CarrierIcon({ carrier }) {
  const icons = {
    AIR: <Plane className="w-3 h-3 text-sky-500" />,
    SEA: <Ship className="w-3 h-3 text-blue-600" />,
    RAIL: <Train className="w-3 h-3 text-amber-600" />,
  };
  return icons[carrier] ?? <Truck className="w-3 h-3 text-gray-400" />;
}

function LcBadge({ lcNumber }) {
  if (!lcNumber) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400 border border-gray-200 uppercase tracking-wide">
        No LC
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wide">
      <CheckCircle2 className="w-3 h-3" /> LC Attached
    </span>
  );
}

function PdfPreviewModal({ state, onClose }) {
  return (
    <AnimatePresence>
      {state.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#003366] rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{state.name}</h2>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    Proforma PDF Preview
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-gray-100 overflow-hidden">
              {state.loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[#003366]" />
                  <p className="text-sm font-semibold text-gray-500">Generating PDF...</p>
                </div>
              ) : (
                <iframe src={state.url} className="w-full h-full border-0" title="Proforma PDF Preview" />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ProformaRow({ pi, onPreview, onDownload }) {
  return (
    <tr className="hover:bg-blue-50/30 transition-colors">

      {/* Proforma No */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-gray-900 truncate">{pi.proformaInvoiceNo}</p>
        </div>
      </td>

      {/* Customer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{pi.customer?.name ?? '—'}</span>
        </div>
        {pi.currency && (
          <div className="flex items-center gap-1.5 mt-1">
            <DollarSign className="w-3 h-3 text-gray-300 shrink-0" />
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
              {getCurrencySymbol(pi.currency)} {pi.currency}
            </span>
          </div>
        )}
      </td>

      {/* Route */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-gray-700 truncate">{pi.countryOfOrigin ?? '—'}</span>
          <span className="text-gray-300 shrink-0">→</span>
          <span className="text-gray-700 truncate">{pi.countryOfDestination ?? '—'}</span>
        </div>
        {(pi.portOfLoading || pi.portOfFinalDestination) && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium">
            <CarrierIcon carrier={pi.preCarriageBy} />
            <span className="truncate">{pi.portOfLoading ?? '—'}</span>
            <span className="shrink-0">→</span>
            <span className="truncate">{pi.portOfFinalDestination ?? '—'}</span>
          </div>
        )}
      </td>

      {/* LC / Payment */}
      <td className="px-6 py-4">
        <LcBadge lcNumber={pi.lcNumber} />
        {pi.lcNumber && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 font-medium">
            <Hash className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{pi.lcNumber}</span>
          </div>
        )}
        {pi.invoicepaymentterm && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
            <CreditCard className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{pi.invoicepaymentterm}</span>
          </div>
        )}
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{formatDate(pi.proformaInvoiceDate)}</span>
        </div>
        {pi.lcDate && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
            <Calendar className="w-3 h-3 text-gray-300 shrink-0" />
            <span className="truncate">LC: {formatDate(pi.lcDate)}</span>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => onPreview(e, pi)}
            className="p-2 hover:bg-blue-50 rounded-lg text-[#003366] transition-all active:scale-90 cursor-pointer"
            title="Preview PDF"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => onDownload(e, pi)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all active:scale-90 cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

const TABLE_COLS = [
  { label: 'Proforma No', icon: <Hash className="w-3 h-3" />, width: 'w-[22%]' },
  { label: 'Customer', icon: <User className="w-3 h-3" />, width: 'w-[16%]' },
  { label: 'Route', icon: <Globe className="w-3 h-3" />, width: 'w-[20%]' },
  { label: 'LC / Payment', icon: <Tag className="w-3 h-3" />, width: 'w-[18%]' },
  { label: 'Date', icon: <Calendar className="w-3 h-3" />, width: 'w-[14%]' },
  { label: 'Actions', icon: null, width: 'w-[10%]', right: true },
];

function TableHead() {
  return (
    <table className="w-full text-left border-collapse table-fixed">
      <colgroup>
        {TABLE_COLS.map((c) => <col key={c.label} className={c.width} />)}
      </colgroup>
      <thead className="bg-gray-50 border-b border-gray-100">
        <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
          {TABLE_COLS.map((c) => (
            <th key={c.label} className={`px-6 py-3 font-semibold ${c.right ? 'text-right' : 'text-left'}`}>
              {c.icon
                ? <span className="flex items-center gap-1.5">{c.icon}{c.label}</span>
                : c.label
              }
            </th>
          ))}
        </tr>
      </thead>
    </table>
  );
}


const PREVIEW_INITIAL = { open: false, url: null, name: '', loading: false };

export default function ProformaInvoice() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [preview, setPreview] = useState(PREVIEW_INITIAL);

  const { data: response, isLoading, isError, error, refetch, isFetching, isSuccess } = useGetMyProformaInvoicesQuery();
  const proformaInvoices = response?.data ?? [];
  const [proformaDownload] = useProformaDownloadMutation();
  const [proformaPreview] = useProformaPreviewMutation();

  const refetchToastId = useRef(null);

  useEffect(() => {
    if (isFetching && !isLoading) {
      refetchToastId.current = toast.loading('Refreshing proforma invoices…');
    }
    if (!isFetching && refetchToastId.current) {
      if (isSuccess) toast.success('Proforma invoices updated', { id: refetchToastId.current });
      if (isError) toast.error('Failed to refresh', { id: refetchToastId.current });
      refetchToastId.current = null;
    }
  }, [isFetching, isSuccess, isError]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message ?? error?.error ?? 'Failed to load proforma invoices');
    }
  }, [isError, error]);

  // Cleanup blob URL on unmount
  useEffect(() => () => { if (preview.url) URL.revokeObjectURL(preview.url); }, [preview.url]);


  const filtered = proformaInvoices.filter((pi) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = [
      pi.proformaInvoiceNo, pi.customer?.name, pi.countryOfDestination,
      pi.portOfLoading, pi.portOfFinalDestination, pi.lcNumber,
    ].some((v) => v?.toLowerCase().includes(term));

    const matchCurrency = selectedCurrency === 'All' || pi.currency === selectedCurrency;
    return matchSearch && matchCurrency;
  });

  async function handleDownload(e, pi) {
    e.stopPropagation();
    try {
      const blob = await proformaDownload(pi.id).unwrap();
      const url = URL.createObjectURL(new Blob([blob]));
      const a = Object.assign(document.createElement('a'), {
        href: url, download: `proforma-${pi.proformaInvoiceNo}.pdf`,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to download PDF');
    }
  }

  async function handlePreview(e, pi) {
    e.stopPropagation();
    setPreview({ open: true, url: null, name: pi.proformaInvoiceNo, loading: true });
    try {
      const blob = await proformaPreview(pi.id).unwrap();
      if (!(blob instanceof Blob)) throw new Error('Invalid PDF response');
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      setPreview({ open: true, url, name: pi.proformaInvoiceNo, loading: false });
    } catch (err) {
      setPreview(PREVIEW_INITIAL);
      toast.error(err?.data?.message || err?.message || 'Failed to load PDF preview');
    }
  }

  function closePreview() {
    if (preview.url) URL.revokeObjectURL(preview.url);
    setPreview(PREVIEW_INITIAL);
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Proforma Invoices
              </h1>
              <p className="text-xs text-gray-400 font-medium leading-tight">
                Manage and generate export proforma invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh"
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/proforma-invoice/generate')}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Proforma Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">

        {/* Filters */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-80">
              <InputBox
                inputFor="proforma-search"
                placeholder="Search by no, customer, port, country..."
                value={searchTerm}
                handleChangeFunction={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={15} />}
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="w-48">
              <CustomSelect
                options={CURRENCY_OPTIONS}
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                placeholder="All Currencies"
              />
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} Total Proformas
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <TableHead />

          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                {TABLE_COLS.map((c) => <col key={c.label} className={c.width} />)}
              </colgroup>
              <tbody className="divide-y divide-gray-50">

                {isLoading && (
                  <tr>
                    <td colSpan={TABLE_COLS.length} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                        <span className="text-gray-400 font-medium text-sm">Loading proforma invoices...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {isError && !isLoading && (
                  <tr>
                    <td colSpan={TABLE_COLS.length} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Receipt className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">Could not load proforma invoices</span>
                        <button
                          onClick={() => refetch()}
                          className="px-4 py-1.5 text-xs font-semibold bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filtered.length === 0 && (
                  <tr>
                    <td colSpan={TABLE_COLS.length} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">No proforma invoices found</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filtered.map((pi) => (
                  <ProformaRow
                    key={pi.id}
                    pi={pi}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                  />
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PdfPreviewModal state={preview} onClose={closePreview} />
    </div>
  );
}