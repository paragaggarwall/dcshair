
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Plus, Loader2, Calendar, User, MapPin, Download, Eye, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputBox from '../components/InputBox';
import { useContractDownloadMutation, useContractPreviewMutation, useGetAllContractMutation } from './contractApi/contractApiSlice';
import toast from 'react-hot-toast';

export default function Contracts() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewState, setPreviewState] = useState({ open: false, url: null, name: '', loading: false });
  const [getAllContract, { isLoading: loading, }] = useGetAllContractMutation();
  const [contractPreview] = useContractPreviewMutation();
  const [contractDownload] = useContractDownloadMutation();

  const fetchContracts = async () => {
    try {
      const res = await getAllContract().unwrap();
      if (res?.success) {
        setContracts(res.data);
        // toast.success(res.message)
      }
    } catch (err) {
      console.error('Error fetching contracts:', err.message);
      toast.error(err.data.message)
    }
  };
  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    return () => {
      if (previewState.url) window.URL.revokeObjectURL(previewState.url);
    };
  }, [previewState.url]);

  const handlePreview = async (e, contract) => {
    e.stopPropagation();

    if (!contract?.id) {
      toast.error("Contract not found");
      return;
    }

    setPreviewState({ open: true, url: null, name: contract?.name || "Contract Preview", loading: true, });
    try {
      const blob = await contractPreview(contract.id).unwrap();
      const blobUrl = URL.createObjectURL(blob);
      setPreviewState({ open: true, url: blobUrl, name: contract?.name || "Contract Preview", loading: false, });
    } catch (err) {
      console.error(err);
      setPreviewState({ open: false, url: null, name: "", loading: false, });
      toast.error(err?.data?.message || err?.message || "Failed to load PDF preview");
    }
  };

  const handleDownload = async (e, contract) => {
    e.stopPropagation();
    try {
      const response = await contractDownload(contract.id).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract-${contract.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(err?.data?.message || err?.message || "Failed to download PDF");
    }
  };

  const closePreview = () => {
    if (previewState.url) window.URL.revokeObjectURL(previewState.url);
    setPreviewState({ open: false, url: null, name: '', loading: false });
  };

  const filteredContracts = contracts.filter(contract =>
    contract?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    contract?.customer?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">

          {/* Left: icon + titles */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Contracts
              </h1>
              <p className="text-xs text-gray-400 font-medium leading-tight">
                Manage and generate export contracts
              </p>
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={fetchContracts}
              disabled={loading}
              title="Refresh"
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {/* Right: CTA */}
            <button
              onClick={() => navigate('/contracts/generate')}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Generate Contract
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
          <div className="w-96">
            <InputBox
              inputFor="contract-search"
              placeholder="Search by contract name or customer..."
              value={searchTerm}
              handleChangeFunction={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={15} />}
              type="text"
              autoComplete="off"
            />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredContracts.length} Total Contracts
          </span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-8 py-3 font-semibold text-left">Contract Details</th>
                <th className="px-8 py-3 font-semibold text-left">Customer</th>
                <th className="px-8 py-3 font-semibold text-left">Origin / Dest</th>
                <th className="px-8 py-3 font-semibold text-left">Date</th>
                <th className="px-8 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
          </table>

          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
              </colgroup>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                        <span className="text-gray-400 font-medium text-sm">Loading contracts...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">No contracts found</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={(e) => handlePreview(e, contract)}
                  >
                    {/* Contract Details */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{contract.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight font-semibold mt-0.5">
                            #CTR-{contract.id.toString().padStart(4, '0')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{contract.customer?.name}</span>
                      </div>
                    </td>

                    {/* Origin → Dest */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-gray-700 truncate">{contract.countryOfOrigin}</span>
                        <span className="text-gray-300 shrink-0">→</span>
                        <span className="text-gray-700 truncate">{contract.countryOfDestination}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {new Date(contract.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handlePreview(e, contract)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-[#003366] transition-all active:scale-90 cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownload(e, contract)}
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
    </div>
  );
}