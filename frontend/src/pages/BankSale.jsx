// import { useState, useEffect, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//     FileText, RotateCcw, Save, Loader2, ChevronRight,
//     Hash, Calendar, DollarSign, AlignLeft,
//     Landmark, AlertCircle, CheckCircle2,
//     RefreshCw, Truck, Package
// } from "lucide-react";
// import {
//     useCreateBankSaleMutation,
//     useGetInvoiceByIdQuery,
//     useGetInvoicesQuery,
// } from "./shippingDetailsAPI/ShippingDetailsApislice";
// import InputBox from "../components/InputBox";
// import CustomSelect from "../components/CustomSelect";
// import toast from "react-hot-toast";

// // ─── Empty form factory ────────────────────────────────────────────────────────
// const makeEmptyForm = () => ({
//     amount: "",
//     bankExchangeRate: "",
//     bankRefNo: "",
//     bankRefDate: "",
//     negotiationAmount: "",
//     lessFreight: "",
//     lessInsurance: "",
//     lessCommissionIfAny: "",
//     bankFobValue: "",
//     dateOfRealisation: "",
//     realisationNarration: "",
//     realisationdueDate: "",
//     courierCompany: "",
//     trackingNo: "",
// });

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
//         <div className="flex items-center gap-1.5 whitespace-nowrap">
//             <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">
//                 {label}
//             </span>
//             <ChevronRight className="w-2.5 h-2.5 text-[#003366] " />
//             <span className="text-xs font-semibold text-slate-700">{value}</span>
//         </div>
//     ) : null;

// // ─── Main component ────────────────────────────────────────────────────────────
// export default function BankSaleDetails({selectedInvoiceId,setSelectedInvoiceId}) {
//     // const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
//     const [formData, setFormData] = useState(makeEmptyForm());

//     // ── RTK Query hooks ──
//     const { data: getMyInvoices, isLoading: invoicesLoading } = useGetInvoicesQuery();
//     const invoicesData = getMyInvoices?.data ?? [];

//     const { data: invoiceDetail, isFetching: invoiceFetching, refetch } = useGetInvoiceByIdQuery(selectedInvoiceId,);
//     const invoiceData = invoiceDetail?.data ?? invoiceDetail ?? null;

//     const [createBankSale, { isLoading: isSubmitting, reset: resetMutation }] = useCreateBankSaleMutation();

//     // ── Auto-fill on invoice fetch ──
//     useEffect(() => {
//         if (invoiceData) {
//             setFormData((prev) => ({
//                 ...prev,
//                 amount: invoiceData?.bankSales[0]?.amount ?? "",
//                 bankExchangeRate: invoiceData.bankSales[0]?.bankExchangeRate ?? "",
//                 negotiationAmount: invoiceData.bankSales[0]?.negotiationAmount ?? "",
//                 lessFreight: invoiceData.bankSales[0]?.lessFreight ?? "",
//                 lessInsurance: invoiceData.bankSales[0]?.lessInsurance ?? "",
//                 lessCommissionIfAny: invoiceData.bankSales[0]?.lessCommissionIfAny ?? "",
//                 bankFobValue: invoiceData.bankSales[0]?.bankFobValue ?? "",
//                 dateOfRealisation: invoiceData.bankSales[0]?.dateOfRealisation,
//                 realisationNarration: invoiceData.bankSales[0]?.realisationNarration,
//                 realisationdueDate: invoiceData.bankSales[0]?.realisationdueDate,
//                 courierCompany: invoiceData.bankSales[0]?.courierCompany,
//                 trackingNo: invoiceData.bankSales[0]?.trackingNo,
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
//             resetMutation?.();
//         },
//         [resetMutation]
//     );

//     const handleReset = useCallback(() => {
//         setFormData(makeEmptyForm());
//         setSelectedInvoiceId("");
//         resetMutation?.();
//     }, [resetMutation]);


//     const buildpayload={

//     }

//     const handleSubmit = async (e) => {
//         e?.preventDefault();
//         try {
//             const res=await createBankSale({
//                 invoiceId: Number(selectedInvoiceId),
//                 ...formData
//             }).unwrap();
//              toast.success(`success:${res?.message}`)
//             await refetch();
//         } catch (err) {
//             toast.error(err?.data?.error || "Failed to save. Please try again.");
//         }
//     };

//     const invoiceOptions = invoicesData.map((inv) => ({
//         id: inv.id,
//         name: inv.invoiceNo,
//     }));

//     return (
//         <div className="flex flex-col h-[calc(100vh-15vh)] bg-slate-50 ">
//             {/* ══ FIXED HEADER ══════════════════════════════════════════════════ */}
//             <div className="shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">
//                 {/* Top row */}
//                 <div className="flex items-center justify-between gap-4 px-6 py-3">

//                     {/* Invoice meta strip */}
//                 <AnimatePresence>
//                     {invoiceData && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="flex items-center gap-5 px-6 py-2 bg-slate-50 rounded-xl border-t border-slate-100 "
//                         >
//                             <MetaPill label="Invoice" value={invoiceData.invoiceNo} />
//                             <MetaPill label="Date" value={invoiceData.invoiceDate?.slice(0, 10)} />
//                             <MetaPill label="Buyer" value={invoiceData?.customer?.name} />
//                             <MetaPill label="Country" value={invoiceData?.customer?.country} />
//                             <MetaPill label="Qty" value={invoiceData.totalQuantity} />
//                             <MetaPill label="Amount" value={invoiceData.totalAmount} />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

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

//             <div className="flex-1 min-h-0 overflow-y-auto">
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
//                                 <Landmark className="w-7 h-7 text-slate-300" />
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

//                         /* Form body */
//                         <motion.div
//                             key="form"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="p-6 space-y-5 max-w-6xl mx-auto"
//                         >



//                             {/* ── Section 1: Bank — Sale & Details ── */}
//                             <Section title="Bank — Sale & Details" icon={Landmark} delay={0.05}>
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
//                                     title="Bank Exchange Rate"
//                                     inputFor="bankExchangeRate"
//                                     value={formData.bankExchangeRate}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.0000"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Bank Ref. No."
//                                     inputFor="bankRefNo"
//                                     value={formData.bankRefNo}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="e.g. BNK-2026-001"
//                                     icon={<Hash size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Bank Ref. Date"
//                                     inputFor="bankRefDate"
//                                     value={formData.bankRefDate}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Negotiation Amount"
//                                     inputFor="negotiationAmount"
//                                     value={formData.negotiationAmount}
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
//                                     inputFor="lessCommissionIfAny"
//                                     value={formData.lessCommissionIfAny}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Bank (F.O.B.) Value"
//                                     inputFor="bankFobValue"
//                                     value={formData.bankFobValue}
//                                     handleChangeFunction={handleChange}
//                                     type="number"
//                                     isDecimalAllowed
//                                     placeholder="0.00"
//                                     icon={<DollarSign size={14} />}
//                                 />
//                             </Section>

//                             {/* ── Section 2: Date of Realisation ── */}
//                             <Section title="Date of Realisation" icon={Calendar} delay={0.1}>
//                                 <InputBox
//                                     title="Date of Realisation"
//                                     inputFor="dateOfRealisation"
//                                     value={formData.dateOfRealisation}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Realisation Due Date"
//                                     inputFor="realisationdueDate"
//                                     value={formData.realisationdueDate}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="YYYY-MM-DD"
//                                     icon={<Calendar size={14} />}
//                                 />
//                                 <div className="md:col-span-2 lg:col-span-3">
//                                     <InputBox
//                                         title="Realisation Narration"
//                                         inputFor="realisationNarration"
//                                         value={formData.realisationNarration}
//                                         handleChangeFunction={handleChange}
//                                         placeholder="Enter narration…"
//                                         icon={<AlignLeft size={14} />}
//                                     />
//                                 </div>
//                             </Section>

//                             {/* ── Section 3: Tracking Status ── */}
//                             <Section title="Tracking Status" icon={Truck} delay={0.15}>
//                                 <InputBox
//                                     title="Courier Company"
//                                     inputFor="courierCompany"
//                                     value={formData.courierCompany}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="e.g. DHL, FedEx"
//                                     icon={<Package size={14} />}
//                                 />
//                                 <InputBox
//                                     title="Tracking No."
//                                     inputFor="trackingNo"
//                                     value={formData.trackingNo}
//                                     handleChangeFunction={handleChange}
//                                     placeholder="e.g. 1Z999AA10123456784"
//                                     icon={<Hash size={14} />}
//                                 />
//                             </Section>

//                             {/* Bottom spacer */}
//                             <div className="h-7" />
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
    Hash, Calendar, DollarSign, AlignLeft,
    Landmark, Truck, Package,
} from "lucide-react";
import InputBox from "../components/InputBox";



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

export default function BankSaleDetails({
    selectedInvoiceId,
    originalData,
    invoiceFetching,
    dirtyData,
    markDirty,
    setDirtyData,
    form: formData,
    setform: setFormData,
}) {

    console.log("formdata", formData);

    // const [formData, setFormData] = useState(makeEmptyForm());

    // useEffect(() => {
    //     const bs = originalData?.bankSales?.[0];
    //     if (bs) {
    //         setFormData({
    //             amount:               bs.amount               ?? "",
    //             bankExchangeRate:     bs.bankExchangeRate      ?? "",
    //             bankRefNo:            bs.bankRefNo             ?? "",
    //             bankRefDate:          bs.bankRefDate           ? bs.bankRefDate.slice(0, 10) : "",
    //             negotiationAmount:    bs.negotiationAmount     ?? "",
    //             lessFreight:          bs.lessFreight           ?? "",
    //             lessInsurance:        bs.lessInsurance         ?? "",
    //             lessCommissionIfAny:  bs.lessCommissionIfAny   ?? "",
    //             bankFobValue:         bs.bankFobValue          ?? "",
    //             dateOfRealisation:    bs.dateOfRealisation     ? bs.dateOfRealisation.slice(0, 10) : "",
    //             realisationNarration: bs.realisationNarration  ?? "",
    //             realisationdueDate:   bs.realisationdueDate    ? bs.realisationdueDate.slice(0, 10) : "",
    //             courierCompany:       bs.courierCompany        ?? "",
    //             trackingNo:           bs.trackingNo            ?? "",
    //         });
    //     } else {
    //         setFormData(makeEmptyForm());
    //     }
    // }, [originalData]);




    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            bankSale: {
                ...prev.bankSale,
                [name]: value,
            },
        }));

        markDirty(`bankSale.${name}`, value);
    }, [markDirty, setFormData]);



    return (
        <div className="flex flex-col h-[calc(100vh-15vh)] bg-slate-50">

            <div className="shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">
                <div className="flex items-center justify-between gap-4 px-6 py-3">

                    {/* Invoice meta strip */}
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

            <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">

                    {/* Empty state */}
                    {!selectedInvoiceId ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full gap-4 text-slate-400"
                        >
                            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                                <Landmark className="w-7 h-7 text-slate-300" />
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
                            {/* ── Section 1: Bank Sale & Details ── */}
                            <Section title="Bank — Sale & Details" icon={Landmark} delay={0.05}>
                                <InputBox
                                    title="Amount"
                                    inputFor="amount"
                                    value={formData.totalAmount || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    isInputBoxDisabled
                                    isMandatory
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Bank Exchange Rate"
                                    inputFor="bankExchangeRate"
                                    value={formData.bankSale?.bankExchangeRate || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.0000"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Bank Ref. No."
                                    inputFor="bankRefNo"
                                    value={formData.bankSale?.bankRefNo || ""}
                                    handleChangeFunction={handleChange}
                                    placeholder="e.g. BNK-2026-001"
                                    icon={<Hash size={14} />}
                                />
                                <InputBox
                                    title="Bank Ref. Date"
                                    inputFor="bankRefDate"
                                    value={formData.bankSale?.bankRefDate || ""}
                                    handleChangeFunction={handleChange}
                                    type="date"
                                    icon={<Calendar size={14} />}
                                />
                                <InputBox
                                    title="Negotiation Amount"
                                    inputFor="negotiationAmount"
                                    value={formData.bankSale?.negotiationAmount || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Less Freight"
                                    inputFor="lessFreight"
                                    value={formData.bankSale?.lessFreight || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Less Insurance"
                                    inputFor="lessInsurance"
                                    value={formData.bankSale?.lessInsurance || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Less Commission (if any)"
                                    inputFor="lessCommissionIfAny"
                                    value={formData.bankSale?.lessCommissionIfAny || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                                <InputBox
                                    title="Bank (F.O.B.) Value"
                                    inputFor="bankFobValue"
                                    value={formData.bankSale?.bankFobValue || ""}
                                    handleChangeFunction={handleChange}
                                    type="number"
                                    isDecimalAllowed
                                    placeholder="0.00"
                                    icon={<DollarSign size={14} />}
                                />
                            </Section>

                            {/* ── Section 2: Date of Realisation ── */}
                            <Section title="Date of Realisation" icon={Calendar} delay={0.1}>
                                <InputBox
                                    title="Date of Realisation"
                                    inputFor="dateOfRealisation"
                                    value={formData.bankSale?.dateOfRealisation || ""}
                                    handleChangeFunction={handleChange}
                                    type="date"
                                    icon={<Calendar size={14} />}
                                />
                                <InputBox
                                    title="Realisation Due Date"
                                    inputFor="realisationdueDate"
                                    value={formData.bankSale?.realisationdueDate || ""}
                                    handleChangeFunction={handleChange}
                                    type="date"
                                    icon={<Calendar size={14} />}
                                />

                                <div className="md:col-span-2 lg:col-span-3">
                                    <InputBox
                                        title="Realisation Narration"
                                        inputFor="realisationNarration"
                                        value={formData.bankSale?.realisationNarration || ""}
                                        handleChangeFunction={handleChange}
                                        placeholder="Enter narration…"
                                        icon={<AlignLeft size={14} />}
                                    />
                                </div>
                            </Section>

                            {/* ── Section 3: Tracking Status ── */}
                            <Section title="Tracking Status" icon={Truck} delay={0.15}>
                                <InputBox
                                    title="Courier Company"
                                    inputFor="courierCompany"
                                    value={formData.bankSale?.courierCompany || ""}
                                    handleChangeFunction={handleChange}
                                    placeholder="e.g. DHL, FedEx"
                                    icon={<Package size={14} />}
                                />
                                <InputBox
                                    title="Tracking No."
                                    inputFor="trackingNo"
                                    value={formData.bankSale?.trackingNo || ""}
                                    handleChangeFunction={handleChange}
                                    placeholder="e.g. 1Z999AA10123456784"
                                    icon={<Hash size={14} />}
                                />
                            </Section>

                            <div className="h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}