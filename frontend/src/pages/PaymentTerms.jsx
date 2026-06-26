// import React, { useState } from "react";
// import {
//   CreditCard,
//   PlusCircle,
//   Loader2,
//   Wallet,
//   Info,
//   ShieldCheck,
// } from "lucide-react";
// import api from "../utils/api";
// import { useCreatetermofpaymentMutation } from "./payment_productApi/payment_productApiSlice";
// import toast from "react-hot-toast";
// //dfdf
// export default function TermsOfPayment() {
//   const [name, setName] = useState("");
//   const [createtermofpayment, { isLoading }] = useCreatetermofpaymentMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {

//       if (!name.trim()) { throw new Error('Payment term name is required') }

//       const body = {
//         name: name.trim(),
//       }
//       const res = await createtermofpayment(body).unwrap();
//       if (res?.success) {
//         toast.success(`"${res.data.name}" created successfully`);
//         setName("");
//       }

//     } catch (err) {
//       console.error('fail to create termofpayment:', err.message);
//       toast.error(err?.data?.message || err?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className=" flex items-center justify-center px-4 py-6  font-sans">

//       <div className="w-full max-w-lg">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
//           <div className="bg-[#003366] px-8 py-8 relative">
//             <span className="absolute top-5 right-5 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
//               Finance
//             </span>

//             <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
//               <Wallet size={24} className="text-white" />
//             </div>

//             <h1 className="text-2xl font-semibold text-white">
//               Terms of Payment
//             </h1>
//             <p className="text-sm text-white/60 mt-1">
//               Create and manage contract payment terms and conditions
//             </p>
//           </div>

//           <div className="p-8">
//             <form onSubmit={handleSubmit}>
//               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
//                 Payment Term Name
//               </label>

//               <div className="relative">
//                 <CreditCard
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <input
//                   type="text"
//                   placeholder="e.g. Net 30 Days, 50% Upfront"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
//                 />
//               </div>

//               <p className="flex items-center gap-2 text-xs text-slate-400 mt-2">
//                 <Info size={13} />
//                 Use clear naming conventions for easy reference
//               </p>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-12 mt-6 rounded-xl bg-[#003366] hover:bg-[#004080] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <PlusCircle size={18} />
//                     Create Payment Term
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="mt-6 border-t border-slate-200 pt-6">
//               <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
//                 <ShieldCheck
//                   size={16}
//                   className="text-slate-400 mt-0.5 flex-shrink-0"
//                 />
//                 <p className="text-xs text-slate-500 leading-5">
//                   Payment terms are saved to your contracts module and available
//                   across all active agreements.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, Loader2, Calendar, User, RefreshCw, Wallet, Info, PlusCircle, ShieldCheck, X } from 'lucide-react';
import InputBox from '../components/InputBox';
import toast from 'react-hot-toast';
import { useLazyGetalltermofpaymentQuery, useCreatetermofpaymentMutation } from './payment_productApi/payment_productApiSlice';
import { AnimatePresence, motion } from "framer-motion";


function CreateTermForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [createtermofpayment, { isLoading }] = useCreatetermofpaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) throw new Error('Payment term name is required');

      const res = await createtermofpayment({ name: name.trim() }).unwrap();
      if (res?.success) {
        toast.success(`"${res.data.name}" created successfully`);
        setName("");
        onSuccess?.();
      }
    } catch (err) {
      console.error('fail to create termofpayment:', err.message);
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

          {/* Modal header */}
          <div className="bg-[#003366] px-8 py-8 relative">
            <span className="absolute top-5 right-5 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
              Finance
            </span>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <Wallet size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Terms of Payment</h1>
            <p className="text-sm text-white/60 mt-1">
              Create and manage contract payment terms and conditions
            </p>
          </div>

          {/* Form body */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Payment Term Name
              </label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Net 30 Days, 50% Upfront"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                />
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <Info size={13} />
                Use clear naming conventions for easy reference
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-6 rounded-xl bg-[#003366] hover:bg-[#004080] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin" />Creating...</>
                ) : (
                  <><PlusCircle size={18} />Create Payment Term</>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <ShieldCheck size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-5">
                  Payment terms are saved to your contracts module and available
                  across all active agreements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TermsOfPayment() {
  const [terms, setTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [getAllTerms, { isLoading: loading }] = useLazyGetalltermofpaymentQuery();

  const fetchTerms = async () => {
    try {
      const res = await getAllTerms().unwrap();
      if (res?.success) {
        setTerms(res.data);
        toast.success(res.message);
      }
    } catch (err) {
      console.error('Error fetching terms of payment:', err.message);
      toast.error(err?.data?.message || 'Failed to fetch terms of payment');
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // After a term is created: close modal + refresh list
  const handleCreated = () => {
    setOpen(false);
    fetchTerms();
  };

  const filteredTerms = terms.filter(term =>
    term?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    term?.createdBy?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
                Terms of Payment
              </h1>
              <p className="text-xs text-gray-400 font-medium leading-tight">
                Manage payment terms for contracts and invoices
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchTerms}
              disabled={loading}
              title="Refresh"
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#004080] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 bg-white shadow-sm overflow-hidden flex flex-col min-h-0 m-4 rounded-2xl border border-gray-100">

        {/* Search + count bar */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
          <div className="w-96">
            <InputBox
              inputFor="term-search"
              placeholder="Search by name or created by..."
              value={searchTerm}
              handleChangeFunction={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={15} />}
              type="text"
              autoComplete="off"
            />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredTerms.length} Total Terms
          </span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* Sticky thead */}
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[30%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-8 py-3 font-semibold text-left">Term Name</th>
                <th className="px-8 py-3 font-semibold text-left">Created By</th>
                <th className="px-8 py-3 font-semibold text-left">Date Added</th>
              </tr>
            </thead>
          </table>

          {/* Scrollable tbody */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[30%]" />
                <col className="w-[30%]" />
              </colgroup>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                        <span className="text-gray-400 font-medium text-sm">Loading terms...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTerms.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className="w-10 h-10 text-gray-200" />
                        <span className="text-gray-400 font-medium text-sm">No terms of payment found</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTerms.map((term) => (
                  <tr key={term.id} className="hover:bg-blue-50/30 transition-colors">

                    {/* Term Name */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 truncate">{term.name}</p>
                      </div>
                    </td>

                    {/* Created By */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{term.createdBy || '—'}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {new Date(term.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Term Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // onClick={() => setOpen(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-xl relative"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-1 right-1 z-10 p-1.5 rounded-lg hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={18} color='red' />
              </button>

              <CreateTermForm onSuccess={handleCreated} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}