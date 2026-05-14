import React, { useState } from "react";
import {
  CreditCard,
  PlusCircle,
  Loader2,
  Wallet,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import api from "../utils/api";
//dfdf
export default function TermsOfPayment() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Payment term name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/contracts/terms-of-payment/", {
        name: name.trim(),
      });

      toast.success(`"${res.data.name}" created successfully`);
      setName("");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center px-4 py-6  font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[#003366] px-8 py-8 relative">
            <span className="absolute top-5 right-5 text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
              Finance
            </span>

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <Wallet size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-semibold text-white">
              Terms of Payment
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Create and manage contract payment terms and conditions
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Payment Term Name
              </label>

              <div className="relative">
                <CreditCard
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

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
                disabled={loading}
                className="w-full h-12 mt-6 rounded-xl bg-[#003366] hover:bg-[#004080] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Create Payment Term
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <ShieldCheck
                  size={16}
                  className="text-slate-400 mt-0.5 flex-shrink-0"
                />
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