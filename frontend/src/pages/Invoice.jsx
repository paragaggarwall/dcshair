
// import { Plus, Receipt } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Invoice() {
//     const navigate = useNavigate();

//     return (
//         <div className="w-full">
//             <div className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm flex-shrink-0 w-full h-20 p-2">

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//                     {/* LEFT SIDE */}
//                     <div className="flex items-center gap-3">

//                         {/* ICON */}
//                         <div className="p-2 bg-blue-50 rounded-lg">
//                             <Receipt className="w-7 h-7 text-[#003366]" />
//                         </div>

//                         {/* TEXT */}
//                         <div className="space-y-1">
//                             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//                                 Invoice
//                             </h1>
//                             <p className="text-sm text-gray-500">
//                                 Manage and generate export invoice efficiently
//                             </p>
//                         </div>

//                     </div>

//                     {/* RIGHT SIDE */}
//                     <div className="flex items-center sm:justify-end">

//                         <button
//                             onClick={() => navigate("/invoice/generate")}
//                             className="group flex items-center gap-2 bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm
//                      shadow-md hover:shadow-lg hover:bg-[#004080]
//                      transition-all active:scale-95"
//                         >
//                             <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
//                             Generate Invoice
//                         </button>

//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }





import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Plus, Receipt, Search, Loader2, Pencil, FileText,
  Globe, MapPin, Package, CreditCard, Calendar, Hash,
  Plane, Ship, Train, Truck, CheckCircle2, Clock,
  AlertCircle, DollarSign, RefreshCw, X, CheckCheck, Info,
  Eye,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import InputBox from '../components/InputBox';
import CustomSelect from '../components/CustomSelect';
import { useGetMyInvoicesQuery, useInvoicePdfGenerateMutation } from './invoiceapi/Invoiceapislice';
import toast from 'react-hot-toast';


const TOAST_ICONS = {
  success: <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
  loading: <Loader2 className="w-4 h-4 text-blue-500 shrink-0 animate-spin" />,
  info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
};

const TOAST_STYLES = {
  success: 'border-emerald-100 bg-emerald-50/80',
  error: 'border-red-100 bg-red-50/80',
  loading: 'border-blue-100 bg-blue-50/80',
  info: 'border-blue-100 bg-blue-50/80',
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${TOAST_STYLES[t.type]}`}
          >
            {TOAST_ICONS[t.type]}
            <p className="text-xs font-semibold text-gray-700 flex-1 leading-relaxed">{t.message}</p>
            <button
              onClick={() => onRemove(t.id)}
              className="text-gray-400 hover:text-gray-600 transition mt-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (type !== 'loading') {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const update = useCallback((id, message, type = 'success') => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, message, type } : t))
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return { toasts, toast: add, removeToast: remove, updateToast: update };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };

function formatAmount(amount, currency = 'USD') {
  const sym = CURRENCY_SYMBOL[currency] ?? currency;
  return `${sym}${Number(amount ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function carrierIcon(carrier) {
  switch (carrier) {
    case 'AIR': return <Plane className="w-3 h-3 text-sky-500" />;
    case 'SEA': return <Ship className="w-3 h-3 text-blue-600" />;
    case 'RAIL': return <Train className="w-3 h-3 text-amber-600" />;
    default: return <Truck className="w-3 h-3 text-gray-400" />;
  }
}

function ShipmentBadge({ invoice }) {
  if (invoice.lorryOutFromCustomWarehouse) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
        <CheckCircle2 className="w-3 h-3" /> Delivered
      </span>
    );
  }
  if (invoice.shippingBillNo) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
        <Clock className="w-3 h-3" /> In Transit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
      <AlertCircle className="w-3 h-3" /> Pending
    </span>
  );
}


export default function Invoice() {
  const navigate = useNavigate();
  const { toasts, removeToast, updateToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [previewState, setPreviewState] = useState({ open: false, url: null, name: '', loading: false });


  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isSuccess,
  } = useGetMyInvoicesQuery();

  const invoices = response?.data ?? [];

  const [invoicePdfGenerate] = useInvoicePdfGenerateMutation();

  // Toast on fetch state transitions
  const loadingToastRef = useRef(null);

  useEffect(() => {
    if (isFetching && !isLoading) {
      loadingToastRef.current = toast('Refreshing invoices…', 'loading');
    }
    if (!isFetching && loadingToastRef.current) {
      if (isSuccess) updateToast(loadingToastRef.current, 'Invoices updated successfully', 'success');
      if (isError) updateToast(loadingToastRef.current, 'Failed to refresh invoices', 'error');
      loadingToastRef.current = null;
    }
  }, [isFetching]);

  useEffect(() => {
    if (isError) {
      toast(
        error?.data?.message ?? error?.error ?? 'Failed to load invoices',
        'error',
        5000
      );
    }
  }, [isError]);

  // Filters
  const filtered = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      inv.invoiceNo?.toLowerCase().includes(term) ||
      inv.countryOfDestination?.toLowerCase().includes(term) ||
      inv.portOfLoading?.toLowerCase().includes(term) ||
      inv.portOfFinalDestination?.toLowerCase().includes(term);
    const matchCurrency = selectedCurrency === 'All' || inv.currency === selectedCurrency;
    const matchStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Delivered' && inv.lorryOutFromCustomWarehouse) ||
      (selectedStatus === 'In Transit' && inv.shippingBillNo && !inv.delivered) ||
      (selectedStatus === 'Pending' && !inv.shippingBillNo && !inv.delivered);
    return matchSearch && matchCurrency && matchStatus;
  });

  const currencyOptions = [
    { id: 'All', name: 'All Currencies' },
    { id: 'USD', name: 'USD – US Dollar' },
    { id: 'EUR', name: 'EUR – Euro' },
    { id: 'GBP', name: 'GBP – Pound' },
    { id: 'INR', name: 'INR – Rupee' },
  ];

  const statusOptions = [
    { id: 'All', name: 'All Statuses' },
    { id: 'Pending', name: 'Pending' },
    { id: 'In Transit', name: 'In Transit' },
    { id: 'Delivered', name: 'Delivered' },
  ];


  async function handleDownload(e, pi) {
    e.stopPropagation();
    try {
      const blob = await invoicePdfGenerate(pi.id).unwrap();
      const url = URL.createObjectURL(new Blob([blob]));
      const a = Object.assign(document.createElement('a'), {
        href: url, download: `invoice-${pi.InvoiceNo}.pdf`,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log("regrtgt", err);
      toast.error(err?.data?.message || err?.message || err?.data || 'Failed to download PDF');
    }
  }


  useEffect(() => {
    return () => {
      if (previewState.url) window.URL.revokeObjectURL(previewState.url);
    };
  }, [previewState.url]);

  const handlePreview = async (e, inv) => {
    e.stopPropagation();

    if (!inv?.id) {
      toast.error("invoice not found");
      return;
    }

    setPreviewState({ open: true, url: null, name: inv?.invoiceNo || "invoice Preview", loading: true, });
    try {
      const blob = await invoicePdfGenerate(inv.id).unwrap();
      const blobUrl = URL.createObjectURL(blob);
      setPreviewState({ open: true, url: blobUrl, name: inv?.invoiceNo || "invoice Preview", loading: false, });
    } catch (err) {
      console.error(err);
      setPreviewState({ open: false, url: null, name: "", loading: false, });
      toast.error(err?.data?.message || err?.message || err?.data || "Failed to load PDF preview");
    }
  };

  const closePreview = () => {
    if (previewState.url) window.URL.revokeObjectURL(previewState.url);
    setPreviewState({ open: false, url: null, name: '', loading: false });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Invoices
              </h1>
              <p className="text-xs text-gray-400 font-medium leading-tight">
                Manage and track all export invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/invoice/generate')}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2
                         hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CARD ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-3 rounded-2xl border border-gray-100">

        {/* ─── SEARCH + FILTERS ─────────────────────────────────────────────── */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-80">
              <InputBox
                inputFor="invoice-search"
                placeholder="Search invoice no, port, country..."
                value={searchTerm}
                handleChangeFunction={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={15} />}
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="w-48">
              <CustomSelect
                options={currencyOptions}
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                placeholder="All Currencies"
              />
            </div>
            <div className="w-40">
              <CustomSelect
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Statuses"
              />
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} Total Invoices
          </span>
        </div>

        {/* ─── TABLE ────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 mb-7">

          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[21%]" />
              <col className="w-[19%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold text-left">
                  <span className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> Invoice</span>
                </th>
                <th className="px-6 py-3 font-semibold text-left">
                  <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Route</span>
                </th>
                <th className="px-6 py-3 font-semibold text-left">
                  <span className="flex items-center gap-1.5"><Package className="w-3 h-3" /> Shipment</span>
                </th>
                <th className="px-6 py-3 font-semibold text-left">
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> Amount</span>
                </th>
                <th className="px-6 py-3 font-semibold text-left">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date / Status</span>
                </th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
          </table>

          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[21%]" />
                <col className="w-[19%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[8%]" />
              </colgroup>
              <tbody className="divide-y divide-gray-50">

                {isLoading && (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                        <span className="text-gray-400 font-medium text-sm">Loading invoices...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {isError && !isLoading && (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Receipt className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">Could not load invoices</span>
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
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">No invoices found</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors">

                    {/* Invoice */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 ">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          {/* <p className="text-sm font-bold text-gray-900 truncate">{inv.invoiceNo}</p> */}
                          <p
                            onClick={() =>
                              navigate(`/maininvoice/${inv.id}`, {
                                state: {
                                  selectedInvoiceId: inv.id,
                                },
                              })
                            }
                            className="text-sm font-bold text-gray-900 truncate underline decoration-2 cursor-pointer hover:text-blue-600"
                          >
                            {inv.invoiceNo}
                          </p>
                          {/* <p className="text-[10px] text-gray-400 uppercase tracking-tight font-semibold mt-0.5">
                            #INV-{String(inv.id).padStart(1, '0')}
                          </p> */}
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate">{inv.countryOfOrigin ?? '—'}</span>
                        <span className="text-gray-300 shrink-0">→</span>
                        <span className="text-gray-700 truncate">{inv.countryOfDestination ?? '—'}</span>
                      </div>
                      {(inv.portOfLoading || inv.portOfFinalDestination) && (
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium">
                          {carrierIcon(inv.preCarriageBy)}
                          <span className="truncate">{inv.portOfLoading ?? '—'}</span>
                          <span className="shrink-0">→</span>
                          <span className="truncate">{inv.portOfFinalDestination ?? '—'}</span>
                        </div>
                      )}
                    </td>

                    {/* Shipment */}
                    <td className="px-6 py-4 space-y-1">
                      {inv.shippingBillNo && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Ship className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">Bill: {inv.shippingBillNo}</span>
                        </div>
                      )}
                      {inv.awbNo && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Plane className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">AWB: {inv.awbNo}</span>
                        </div>
                      )}
                      {inv.containerNo && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Package className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">Cont: {inv.containerNo}</span>
                        </div>
                      )}
                      {!inv.shippingBillNo && !inv.awbNo && !inv.containerNo && (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {formatAmount(inv.totalAmount, inv.currency)}
                        </span>
                      </div>
                      {inv.currency && (
                        <p className="text-[10px] text-blue-600 font-bold mt-0.5 ml-4 uppercase tracking-wide">
                          {inv.currency}
                        </p>
                      )}
                    </td>

                    {/* Date + Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {new Date(inv.invoiceDate).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <ShipmentBadge invoice={inv} />
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      {/* <div className="flex items-center justify-end">
                        <button
                          //   onClick={() => navigate(`/invoice/edit/${inv.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all active:scale-90 cursor-pointer"
                          title="Edit Invoice"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div> */}

                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handlePreview(e, inv)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-[#003366] transition-all active:scale-90 cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownload(e, inv)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all active:scale-90 cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewState.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePreview}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#003366] rounded-lg">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">{previewState.name}</h2>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Contract PDF Preview</p>
                  </div>
                </div>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-100 overflow-hidden">
                {previewState.loading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#003366]" />
                    <p className="text-sm font-semibold text-gray-500">Generating PDF...</p>
                  </div>
                ) : (
                  <iframe
                    src={previewState.url}
                    className="w-full h-full border-0"
                    title="Contract PDF Preview"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ TOASTS ══════════════════════════════════════════════════════════ */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Outlet />
    </div>
  );
}