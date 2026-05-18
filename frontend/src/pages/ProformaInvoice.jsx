

import { Plus, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProformaInvoice() {
  const navigate = useNavigate();

  return (
   <div className="w-full">
  <div className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm flex-shrink-0 w-full h-20 p-2">

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* ICON */}
        <div className="p-2 bg-blue-50 rounded-lg">
          <Receipt className="w-7 h-7 text-[#003366]" />
        </div>

        {/* TEXT */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Proforma Invoice
          </h1>
          <p className="text-sm text-gray-500">
            Manage and generate export invoices efficiently
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center sm:justify-end">

        <button
          onClick={() => navigate("/proformainvoice/generate")}
          className="group flex items-center gap-2 bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm
                     shadow-md hover:shadow-lg hover:bg-[#004080]
                     transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          Generate Invoice
        </button>

      </div>

    </div>
  </div>
</div>
  );
}