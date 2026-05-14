// import React, { useState } from "react";
// import {
//   CreditCard,
//   PlusCircle,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   Wallet,
//   Info,
//   ShieldCheck,
// } from "lucide-react";
// import api from "../utils/api";

// export default function TermsOfPayment() {
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!name.trim()) {
//       setError("Payment term name is required.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await api.post("/contracts/terms-of-payment/", {
//         name: name.trim(),
//       });
//       setMessage(`"${res.data.name}" created successfully`);
//       setName("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{ fontFamily: "'DM Sans', sans-serif" }}
//       className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-"
//     >
//       {/* Google Font import via style tag */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
//         .top-card { font-family: 'DM Sans', sans-serif; }
//         .header-title { font-family: 'DM Serif Display', serif; font-weight: 400; }
//         .pay-input:focus { outline: none; border-color: #003366 !important; box-shadow: 0 0 0 3px rgba(0,51,102,0.12); }
//         .pay-input::placeholder { color: #94a3b8; font-weight: 300; }
//         .pay-btn { background: #003366; transition: background 0.15s, transform 0.1s; }
//         .pay-btn:hover:not(:disabled) { background: #004080; }
//         .pay-btn:active:not(:disabled) { transform: scale(0.99); }
//         .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
//         .fade-in { animation: fadeIn 0.25s ease forwards; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .spinner { animation: spin 0.65s linear infinite; }
//       `}</style>

//       <div className="top-card w-full max-w-lg">
//         {/* Card */}
//         <div
//           className="w-full rounded-2xl overflow-hidden"
//           style={{
//             background: "#ffffff",
//             border: "0.5px solid #e2e8f0",
//             boxShadow: "0 4px 32px rgba(0,51,102,0.08)",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{ background: "#003366", padding: "2rem 2rem 1.75rem", position: "relative" }}
//           >
//             {/* Badge */}
//             <span
//               style={{
//                 position: "absolute",
//                 top: 20,
//                 right: 20,
//                 background: "rgba(255,255,255,0.10)",
//                 border: "0.5px solid rgba(255,255,255,0.20)",
//                 color: "rgba(255,255,255,0.70)",
//                 fontSize: 11,
//                 fontWeight: 500,
//                 padding: "4px 10px",
//                 borderRadius: 100,
//                 letterSpacing: "0.4px",
//                 textTransform: "uppercase",
//               }}
//             >
//               Finance
//             </span>

//             {/* Icon block */}
//             <div
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 14,
//                 background: "rgba(255,255,255,0.12)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: "1rem",
//               }}
//             >
//               <Wallet size={24} color="#ffffff" />
//             </div>

//             <h1
//               className="header-title"
//               style={{ margin: 0, fontSize: 22, color: "#ffffff", letterSpacing: "-0.2px" }}
//             >
//               Terms of Payment
//             </h1>
//             <p
//               style={{
//                 margin: "6px 0 0",
//                 fontSize: 13,
//                 color: "rgba(255,255,255,0.60)",
//                 fontWeight: 300,
//               }}
//             >
//               Create and manage contract payment terms and conditions
//             </p>
//           </div>

//           {/* Body */}
//           <div style={{ padding: "2rem" }}>
//             <form onSubmit={handleSubmit} noValidate>
//               {/* Field label */}
//               <label
//                 htmlFor="pterm"
//                 style={{
//                   display: "block",
//                   fontSize: 11,
//                   fontWeight: 600,
//                   letterSpacing: "0.6px",
//                   textTransform: "uppercase",
//                   color: "#64748b",
//                   marginBottom: 8,
//                 }}
//               >
//                 Payment Term Name
//               </label>

//               {/* Input */}
//               <div style={{ position: "relative" }}>
//                 <CreditCard
//                   size={17}
//                   color="#94a3b8"
//                   style={{
//                     position: "absolute",
//                     left: 14,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     pointerEvents: "none",
//                   }}
//                 />
//                 <input
//                   id="pterm"
//                   type="text"
//                   className="pay-input"
//                   placeholder="e.g. Net 30 Days, 50% Upfront"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   style={{
//                     width: "100%",
//                     boxSizing: "border-box",
//                     height: 48,
//                     paddingLeft: 42,
//                     paddingRight: 14,
//                     border: "0.5px solid #cbd5e1",
//                     borderRadius: 12,
//                     fontSize: 15,
//                     fontFamily: "inherit",
//                     color: "#0f172a",
//                     background: "#f8fafc",
//                     transition: "border-color 0.15s, box-shadow 0.15s",
//                   }}
//                 />
//               </div>

//               {/* Hint */}
//               <p
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 5,
//                   fontSize: 12,
//                   color: "#94a3b8",
//                   marginTop: 8,
//                   marginBottom: 0,
//                 }}
//               >
//                 <Info size={13} />
//                 Use clear, standard naming conventions for easy reference
//               </p>

//               {/* Submit button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="pay-btn"
//                 style={{
//                   width: "100%",
//                   height: 50,
//                   marginTop: "1.5rem",
//                   color: "#ffffff",
//                   border: "none",
//                   borderRadius: 12,
//                   fontSize: 15,
//                   fontFamily: "inherit",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2
//                       size={17}
//                       className="spinner"
//                       style={{ flexShrink: 0 }}
//                     />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <PlusCircle size={17} style={{ flexShrink: 0 }} />
//                     Create Payment Term
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Success */}
//             {message && (
//               <div
//                 className="fade-in"
//                 style={{
//                   marginTop: "1.25rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   background: "#e6f1fb",
//                   border: "0.5px solid #b5d4f4",
//                   color: "#0c447c",
//                   padding: "12px 14px",
//                   borderRadius: 10,
//                   fontSize: 13,
//                 }}
//               >
//                 <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
//                 <span>{message}</span>
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <div
//                 className="fade-in"
//                 style={{
//                   marginTop: "1.25rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   background: "#fcebeb",
//                   border: "0.5px solid #f7c1c1",
//                   color: "#791f1f",
//                   padding: "12px 14px",
//                   borderRadius: 10,
//                   fontSize: 13,
//                 }}
//               >
//                 <AlertCircle size={18} style={{ flexShrink: 0 }} />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Divider */}
//             <div
//               style={{
//                 height: "0.5px",
//                 background: "#e2e8f0",
//                 margin: "1.5rem 0",
//               }}
//             />

//             {/* Footer note */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 10,
//                 background: "#f8fafc",
//                 border: "0.5px solid #e2e8f0",
//                 borderRadius: 10,
//                 padding: "12px 14px",
//               }}
//             >
//               <ShieldCheck size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: 1 }} />
//               <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
//                 Payment terms are saved to your contracts module and available
//                 across all active agreements.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





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