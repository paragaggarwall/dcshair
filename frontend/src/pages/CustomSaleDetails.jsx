// import { useState, useEffect, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//     FileText, RotateCcw, Save, Loader2, ChevronRight,
//     Hash, Calendar, DollarSign, Percent, AlignLeft,
//     Package, TrendingUp, Target, AlertCircle, CheckCircle2,
//     RefreshCw
// } from "lucide-react";
// import {
//     useCreateCustomSaleMutation,
//     useGetInvoiceByIdQuery,
//     useGetInvoicesQuery,
// } from "./shippingDetailsAPI/ShippingDetailsApislice";
// import InputBox from "../components/InputBox";
// import CustomSelect from "../components/CustomSelect";

// // ─── Empty form factory ────────────────────────────────────────────────────────
// const makeEmptyForm = () => ({
//     amount: "",
//     customExchangeRate: "",
//     shippingBillNo: "",
//     shippingBillDate: "",
//     cifCfrValue: "",
//     lessFreight: "",
//     lessInsurance: "",
//     lessCommission: "",
//     customFobValue: "",
//     drawBackPercentage: "",
//     drawBackValue: "",
//     drawBackDateReceived: "",
//     drawBackNarration: "",
//     focusPercentage: "",
//     focusValue: "",
//     focusDateReceived: "",
// });

// // ─── Section wrapper ───────────────────────────────────────────────────────────
// const Section = ({ title, icon: Icon, children, delay = 0 }) => (
//     <motion.div
//         initial={{ opacity: 0, y: 14 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35, delay }}
//         className="border border-slate-200 rounded-2xl overflow-hidden"
//     >
//         <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
//             <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
//                 <Icon className="w-3.5 h-3.5 text-slate-500" />
//             </div>
//             <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500">
//                 {title}
//             </h3>
//         </div>
//         <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
//             {children}
//         </div>
//     </motion.div>
// );

// // ─── Meta pill ─────────────────────────────────────────────────────────────────
// const MetaPill = ({ label, value }) =>
//     value ? (
//         <div className="flex items-center gap-1.5 whitespace-nowrap ">
//             <span className="text-[12px] font-bold uppercase  tracking-widest text-slate-400">
//                 {label}
//             </span>
//             <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
//             <span className="text-xs font-semibold text-slate-700">{value}</span>
//         </div>
//     ) : null;

// export default function CustomSaleDetails({ selectedInvoiceId }) {
//     // const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
//     const [formData, setFormData] = useState(makeEmptyForm());
//     const [successMsg, setSuccessMsg] = useState("");
//     const [errorMsg, setErrorMsg] = useState("");

//     // ── RTK Query hooks ──
//     const { data: getMyInvoices, isLoading: invoicesLoading } = useGetInvoicesQuery();
//     const invoicesData = getMyInvoices?.data ?? [];

//     const { data: invoiceDetail, isFetching: invoiceFetching, refetch } = useGetInvoiceByIdQuery(selectedInvoiceId, { skip: !selectedInvoiceId,});


//     const invoiceData = invoiceDetail?.data ?? invoiceDetail ?? null;

//     const [createCustomSale, { isLoading: isSubmitting, reset: resetMutation }] = useCreateCustomSaleMutation();

//     // ── Auto-fill on invoice fetch ──
//     useEffect(() => {
//         if (invoiceData) {
//             setFormData((prev) => ({
//                 ...prev,
//                 amount: invoiceData.totalAmount ?? "",
//                 shippingBillNo: invoiceData.shippingBillNo ?? "",
//                 shippingBillDate: invoiceData.shippingBillDate
//                     ? invoiceData.shippingBillDate.slice(0, 10)
//                     : "",
//                 customExchangeRate: invoiceData?.customSale?.customExchangeRate ?? "",
//                 cifCfrValue: invoiceData?.customSale?.cifCfrValue ?? "",
//                 lessFreight: invoiceData?.customSale?.lessFreight ?? "",
//                 lessInsurance: invoiceData?.customSale?.lessInsurance ?? "",
//                 lessCommission: invoiceData?.customSale?.lessCommission ?? "",
//                 customFobValue: invoiceData?.customSale?.customFobValue ?? "",
//                 drawBackPercentage: invoiceData?.customSale?.drawBackPercentage ?? "",
//                 drawBackValue: invoiceData?.customSale?.drawBackValue ?? "",
//                 drawBackDateReceived: invoiceData?.customSale?.drawBackDateReceived ?? "",
//                 drawBackNarration: invoiceData?.customSale?.drawBackNarration ?? "",
//                 focusPercentage: invoiceData?.customSale?.focusPercentage ?? "",
//                 focusValue: invoiceData?.customSale?.focusValue ?? "",
//                 focusDateReceived: invoiceData?.customSale?.focusDateReceived ?? "",

//             }));
//         }
//     }, [invoiceData]);

//     // ── Handlers ──
//     const handleChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     }, []);

//     const handleInvoiceChange = useCallback(
//         (id) => {
//             setSelectedInvoiceId(id);
//             setFormData(makeEmptyForm());
//             setSuccessMsg("");
//             setErrorMsg("");
//             resetMutation?.();
//         },
//         [resetMutation]
//     );

//     const handleReset = useCallback(() => {
//         setFormData(makeEmptyForm());
//         setSelectedInvoiceId("");
//         setSuccessMsg("");
//         setErrorMsg("");
//         resetMutation?.();
//     }, [resetMutation]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMsg("");
//         setSuccessMsg("");
//         try {
//             await createCustomSale({
//                 invoiceId: Number(selectedInvoiceId),
//                 ...formData
//             }).unwrap();
//             setSuccessMsg("Custom sale details saved successfully!");
//             setTimeout(() => setSuccessMsg(""), 4000);
//         } catch (err) {
//             setErrorMsg(err?.data?.message || "Failed to save. Please try again.");
//             setTimeout(() => setErrorMsg(""), 5000);
//         }
//     };

//     const invoiceOptions = invoicesData.map((inv) => ({
//         id: inv.id,
//         name: inv.invoiceNo,
//     }));

//     return (
//         <div className="flex flex-col h-[calc(100vh-15vh)] bg-slate-50 overflow-hidden">

//             {/* ══ FIXED HEADER ══════════════════════════════════════════════════ */}
//             <div className="flex-shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">

//                 {/* Top row */}
//                 <div className="flex items-center justify-between gap-4 px-6 py-3">
//                     {/* Invoice select */}
//                     <AnimatePresence>
//                         {invoiceData && (
//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 transition={{ duration: 0.2 }}
//                                 className="flex items-center gap-5 px-6 py-2 bg-slate-50 rounded-xl border-t border-slate-100"
//                             >
//                                 <MetaPill label="Invoice" value={invoiceData.invoiceNo} />
//                                 <MetaPill label="Date" value={invoiceData.invoiceDate?.slice(0, 10)} />
//                                 <MetaPill label="Buyer" value={invoiceData?.customer?.name} />
//                                 <MetaPill label="Country" value={invoiceData?.customer?.country} />
//                                 <MetaPill label="Qty" value={invoiceData.totalQuantity} />
//                                 <MetaPill label="Amount" value={invoiceData.totalAmount} />
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {/* Right controls */}
//                     <div className="flex items-center gap-2.5 flex-shrink-0">

//                         {/* Reset */}
//                         <button
//                             type="button"
//                             onClick={handleReset}
//                             className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
//                         >
//                             <RotateCcw className="w-3.5 h-3.5" />
//                             Reset
//                         </button>

//                         {/* Save */}
//                         <button
//                             type="button"
//                             onClick={handleSubmit}
//                             disabled={isSubmitting || !selectedInvoiceId}
//                             className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all duration-150 shadow-sm"
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                                     Saving…
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="w-3.5 h-3.5" />
//                                     Save
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </div>

//             </div>

//             {/* ══ SCROLLABLE BODY ═══════════════════════════════════════════════ */}
//             <div className="flex-1 min-h-0 overflow-y-auto ">
//                 <AnimatePresence mode="wait">

//                     {/* Empty state */}
//                     {!selectedInvoiceId ? (
//                         <motion.div
//                             key="empty"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="flex flex-col items-center justify-center h-full gap-4 text-slate-400"
//                         >
//                             <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
//                                 <FileText className="w-7 h-7 text-slate-300" />
//                             </div>
//                             <div className="text-center space-y-1">
//                                 <p className="text-sm font-semibold text-slate-500">
//                                     No Invoice Selected
//                                 </p>
//                                 <p className="text-xs text-slate-400">
//                                     Select an invoice from the dropdown above to begin
//                                 </p>
//                             </div>
//                         </motion.div>
//                     ) : (

//                         /* Form */
//                         <motion.div
//                             key="form"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="p-6 space-y-5 max-w-6xl mx-auto "
//                         >

//                             {/* ── Toast: Success ── */}
//                             <AnimatePresence>
//                                 {successMsg && (
//                                     <motion.div
//                                         key="success"
//                                         initial={{ opacity: 0, y: -8 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -8 }}
//                                         className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium"
//                                     >
//                                         <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                                         {successMsg}
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>

//                             {/* ── Toast: Error ── */}
//                             <AnimatePresence>
//                                 {errorMsg && (
//                                     <motion.div
//                                         key="error"
//                                         initial={{ opacity: 0, y: -8 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, y: -8 }}
//                                         className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
//                                     >
//                                         <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
//                                         {errorMsg}
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>

//                             {/* ── Section 1: Custom Sale & Details ── */}
//                             <Section title="Custom — Sale & Details" icon={Package} delay={0.05}>
//                                 <InputBox
//                                     title="Amount"
//                                     inputFor="amount"
//                                     value={formData.amount}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     isMandatory
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />

//                                 <InputBox
//                                     title="Shipping Bill No."
//                                     inputFor="shippingBillNo"
//                                     value={formData.shippingBillNo}
//                                     handleChangeFunction={handleChange}
//                                     isMandatory
//                                     placeholder="e.g. 532415"
//                                     icon={<Hash size={14} />}
//                                 />

//                                 <InputBox
//                                     title="Shipping Bill Date"
//                                     inputFor="shippingBillDate"
//                                     value={formData.shippingBillDate}
//                                     handleChangeFunction={handleChange}
//                                     type="text"
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />

//                                 <InputBox
//                                     title="Custom Exchange Rate"
//                                     inputFor="customExchangeRate"
//                                     value={formData.customExchangeRate}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.0000"
//                                     icon={<TrendingUp size={14} />}
//                                 />
//                                 <InputBox
//                                     title="CIF / C&F / CFR Value"
//                                     inputFor="cifCfrValue"
//                                     value={formData.cifCfrValue}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Less Freight"
//                                     inputFor="lessFreight"
//                                     value={formData.lessFreight}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Less Insurance"
//                                     inputFor="lessInsurance"
//                                     value={formData.lessInsurance}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Less Commission (if any)"
//                                     inputFor="lessCommission"
//                                     value={formData.lessCommission}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Custom (F.O.B.) Value"
//                                     inputFor="customFobValue"
//                                     value={formData.customFobValue}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                             </Section>

//                             {/* ── Section 2: Draw Back Incentives ── */}
//                             <Section title="Draw Back Incentives" icon={TrendingUp} delay={0.1}>
//                                 <InputBox
//                                     title="Draw Back Percentage"
//                                     inputFor="drawBackPercentage"
//                                     value={formData.drawBackPercentage}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     isSufixOrPrefix="sufix"
//                                     measure="%"
//                                     icon={<Percent size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Draw Back Value"
//                                     inputFor="drawBackValue"
//                                     value={formData.drawBackValue}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Draw Back Date Received"
//                                     inputFor="drawBackDateReceived"
//                                     value={formData.drawBackDateReceived}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />
//                                 <div className="md:col-span-2 lg:col-span-3">
//                                     <InputBox
//                                         title="Draw Back Narration"
//                                         inputFor="drawBackNarration"
//                                         value={formData.drawBackNarration}
//                                         handleChangeFunction={handleChange}
//                                         placeholder="Enter narration…"
//                                         icon={<AlignLeft size={14} />}
//                                     />
//                                 </div>
//                             </Section>

//                             {/* ── Section 3: Focus Incentives ── */}
//                             <Section title="Focus Incentives" icon={Target} delay={0.15}>
//                                 <InputBox
//                                     title="Focus Percentage"
//                                     inputFor="focusPercentage"
//                                     value={formData.focusPercentage}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     isSufixOrPrefix="sufix"
//                                     measure="%"
//                                     icon={<Percent size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Focus Value"
//                                     inputFor="focusValue"
//                                     value={formData.focusValue}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Focus Date Received"
//                                     inputFor="focusDateReceived"
//                                     value={formData.focusDateReceived}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />
//                             </Section>

//                             {/* Bottom spacer */}
//                             <div className="h-4" />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// }



import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FileText, RotateCcw, Loader2, ChevronRight,
    Hash, Calendar, DollarSign, Percent, AlignLeft,
    Package, TrendingUp, Target,
} from "lucide-react";
import InputBox from "../components/InputBox";



// ─── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay }}
        className="border border-slate-200 rounded-2xl "
    >
        <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500">{title}</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
            {children}
        </div>
    </motion.div>
);

const MetaPill = ({ label, value }) =>
    value ? (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
            <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    ) : null;

export default function CustomSaleDetails({
    selectedInvoiceId,
    originalData,
    invoiceFetching,
    dirtyData,
    markDirty,
    setDirtyData,
    form: formData,
    setform: setFormData,
}) {


    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            customSale: {
                ...prev.customSale,
                [name]: value,
            },
        }));

        markDirty(`customSale.${name}`, value);
    }, [markDirty, setFormData]);

 

    return (
        <div className="flex flex-col h-[calc(100vh-15vh)] bg-slate-50 overflow-hidden">

            {/* ── Sub-header ── */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">
                <div className="flex items-center justify-between gap-4 px-6 py-3">
                    <AnimatePresence>
                        {originalData && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100"
                            >
                                <MetaPill label="Invoice" value={originalData.invoiceNo} />
                                <MetaPill label="Date" value={originalData.invoiceDate?.slice(0, 10)} />
                                <MetaPill label="Buyer" value={originalData.customer?.name} />
                                <MetaPill label="Country" value={originalData.customer?.country} />
                                <MetaPill label="Amount" value={originalData.totalAmount} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                 
                </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {!selectedInvoiceId ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full gap-4"
                        >
                            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                                <FileText className="w-7 h-7 text-slate-300" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-semibold text-slate-500">No Invoice Selected</p>
                                <p className="text-xs text-slate-400">Select an invoice from the dropdown above to begin</p>
                            </div>
                        </motion.div>
                    ) : invoiceFetching ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full"
                        >
                            <Loader2 className="w-6 h-6 animate-spin text-[#003366]" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="p-6 space-y-5 max-w-6xl mx-auto"
                        >
                            {/* ── Section 1: Custom Sale & Details ── */}
                            <Section title="Custom — Sale & Details" icon={Package} delay={0.05}>
                                <InputBox title="Amount" isInputBoxDisabled inputFor="amount" value={formData.totalAmount} handleChangeFunction={handleChange} type="number" isDecimalAllowed isMandatory placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Shipping Bill No." isInputBoxDisabled inputFor="shippingBillNo" value={formData.shippingBillNo} handleChangeFunction={handleChange} isMandatory placeholder="e.g. 532415" icon={<Hash size={14} />} />
                                <InputBox title="Shipping Bill Date" isInputBoxDisabled inputFor="shippingBillDate" value={formData.shippingBillDate} handleChangeFunction={handleChange} type="date" icon={<Calendar size={14} />} />
                                <InputBox title="Custom Exchange Rate" inputFor="customExchangeRate" value={formData?.customSale?.customExchangeRate} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.0000" icon={<TrendingUp size={14} />} />
                                <InputBox title="CIF / C&F / CFR Value" inputFor="cifCfrValue" value={formData?.customSale?.cifCfrValue} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Less Freight" inputFor="lessFreight" value={formData?.customSale?.lessFreight} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Less Insurance" inputFor="lessInsurance" value={formData?.customSale?.lessInsurance} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Less Commission (if any)" inputFor="lessCommission" value={formData?.customSale?.lessCommission} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Custom (F.O.B.) Value" inputFor="customFobValue" value={formData?.customSale?.customFobValue} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                            </Section>

                            {/* ── Section 2: Draw Back Incentives ── */}
                            <Section title="Draw Back Incentives" icon={TrendingUp} delay={0.1}>
                                <InputBox title="Draw Back Percentage" inputFor="drawBackPercentage" value={formData?.customSale?.drawBackPercentage} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" isSufixOrPrefix="sufix" measure="%" icon={<Percent size={14} />} />
                                <InputBox title="Draw Back Value" inputFor="drawBackValue" value={formData?.customSale?.drawBackValue} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Draw Back Date Received" inputFor="drawBackDateReceived" value={formData?.customSale?.drawBackDateReceived} handleChangeFunction={handleChange} type="date" icon={<Calendar size={14} />} />
                                <div className="md:col-span-2 lg:col-span-3">
                                    <InputBox title="Draw Back Narration" inputFor="drawBackNarration" value={formData?.customSale?.drawBackNarration} handleChangeFunction={handleChange} placeholder="Enter narration…" icon={<AlignLeft size={14} />} />
                                </div>
                            </Section>

                            {/* ── Section 3: Focus Incentives ── */}
                            <Section title="Focus Incentives" icon={Target} delay={0.15}>
                                <InputBox title="Focus Percentage" inputFor="focusPercentage" value={formData?.customSale?.focusPercentage} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" isSufixOrPrefix="sufix" measure="%" icon={<Percent size={14} />} />
                                <InputBox title="Focus Value" inputFor="focusValue" value={formData?.customSale?.focusValue} handleChangeFunction={handleChange} type="number" isDecimalAllowed placeholder="0.00" icon={<DollarSign size={14} />} />
                                <InputBox title="Focus Date Received" inputFor="focusDateReceived" value={formData?.customSale?.focusDateReceived} handleChangeFunction={handleChange} type="date" icon={<Calendar size={14} />} />
                            </Section>

                            <div className="h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}