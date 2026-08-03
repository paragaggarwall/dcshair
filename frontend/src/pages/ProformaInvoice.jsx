

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