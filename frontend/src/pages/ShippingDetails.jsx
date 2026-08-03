


// import React, { useState, useEffect, useCallback } from "react";
// import {
//     FileText, Ship, Loader2,
//     Calendar, MessageSquare, ChevronDown, ChevronRight,
//     CheckCircle2, Circle,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import InputBox from "../components/InputBox";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const safeStr = (val) => val ?? "";
// const safeNum = (val) => (val != null ? val : "");

// // ─── Empty form ───────────────────────────────────────────────────────────────
// const makeDefaultForm = () => ({
//     shippingBillNo: "",
//     shippingDate: "",
//     blOrAwbNo: "",
//     dated: "",
//     narration: "",
//     grossWeight: "",
//     cha: "",
//     vesselNameOrFlightNo: "",
//     shippingLineOrAirlineName: "",
//     destination: "",
//     noOfPacks: "",
//     port: "",
//     netWeight: "",
//     ebrcReceived: false,
//     ebrcReceivedDate: "",
//     ebrcNarration: "",
//     grRelease: false,
//     grReleaseDate: "",
//     grNarration: "",
//     epCopy: false,
//     epCopyDate: "",
//     epNarration: "",
//     exporterCopy: false,
//     exporterCopyDate: "",
//     exporterNarration: "",
// });

// // ─── Section Heading ──────────────────────────────────────────────────────────
// function SectionHeading({ icon: Icon, title }) {
//     return (
//         <div className="flex items-center gap-2 mb-1">
//             {Icon && <Icon size={13} className="text-[#003366]" />}
//             <span className="text-[10px] font-bold uppercase tracking-widest text-[#003366]">
//                 {title}
//             </span>
//         </div>
//     );
// }

// function FieldGrid({ children, cols = 2 }) {
//     return (
//         <div className={`grid gap-x-6 gap-y-4 mt-3 ${cols === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
//             {children}
//         </div>
//     );
// }

// // ─── DocTrackCard ─────────────────────────────────────────────────────────────
// function DocTrackCard({
//     label, checked, onCheck, isOpen, onToggleOpen,
//     dateValue, onDateChange, narrationValue, onNarrationChange,
// }) {
//     const isFilled = !!(dateValue?.trim() && narrationValue?.trim());

//     return (
//         <div className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${checked ? "border-[#003366] bg-blue-50/30" : "border-gray-100 bg-white"}`}>
//             <div
//                 className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                 onClick={onToggleOpen}
//             >
//                 <div className="flex items-center gap-2.5">
//                     <div onClick={(e) => { e.stopPropagation(); onCheck(); }} className="flex-shrink-0">
//                         {checked
//                             ? <CheckCircle2 size={16} className="text-[#003366] transition-colors" />
//                             : <Circle size={16} className="text-gray-300 hover:text-gray-400 transition-colors" />
//                         }
//                     </div>
//                     <span className={`text-[12px] font-bold tracking-wide transition-colors ${checked ? "text-[#003366]" : "text-slate-600"}`}>
//                         {label}
//                     </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${isFilled ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
//                         {isFilled ? "FILLED" : "PENDING"}
//                     </span>
//                     <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//                 </div>
//             </div>

//             {isOpen && (
//                 <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
//                     <div className="pt-3 flex items-end gap-2">
//                         <Calendar size={14} className="text-[#003366] flex-shrink-0 mb-2" />
//                         <div className="flex-1">
//                             <InputBox
//                                 title="Date"
//                                 inputFor={`${label}-date`}
//                                 type="text"
//                                 placeholder="DD-MM-YYYY"
//                                 value={dateValue}
//                                 handleChangeFunction={(e) => onDateChange(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="flex items-end gap-2">
//                         <MessageSquare size={14} className="text-[#003366] flex-shrink-0 mb-2" />
//                         <div className="flex-1">
//                             <InputBox
//                                 title="Narration"
//                                 inputFor={`${label}-narration`}
//                                 placeholder="Add a note..."
//                                 value={narrationValue}
//                                 handleChangeFunction={(e) => onNarrationChange(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── MetaPill ─────────────────────────────────────────────────────────────────
// function MetaPill({ label, value }) {
//     if (!value) return null;
//     return (
//         <div className="flex items-center gap-1.5 whitespace-nowrap">
//             <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
//             <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
//             <span className="text-xs font-semibold text-slate-700">{value}</span>
//         </div>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// // Props from MainInvoice:
// //   selectedInvoiceId  — string
// //   originalData       — fetched invoice object (read-only)
// //   invoiceFetching    — boolean
// //   dirtyData          — { fieldKey: newValue }
// //   markDirty          — (key, value) => void
// //   setDirtyData       — setter (used only to sync on data load)
// export default function ShippingDetails({
//     selectedInvoiceId,
//     originalData,
//     invoiceFetching,
//     dirtyData,
//     markDirty,
//     setDirtyData,
// }) {
//     const [form, setForm] = useState(makeDefaultForm());
//     const [openCards, setOpenCards] = useState({
//         ebrcReceived: false,
//         grRelease: false,
//         epCopy: false,
//         exporterCopy: false,
//     });

//     // ── Populate form when server data arrives ────────────────────────────────
//     useEffect(() => {
//         if (!originalData) return;

//         const loaded = {
//             ...makeDefaultForm(),
//             destination: safeStr(originalData.portOfFinalDestination),
//             noOfPacks: safeStr(originalData.packing),
//             port: safeStr(originalData.portOfLoading),
//             netWeight: safeNum((parseFloat(originalData.packing) || 0) * 25),
//             grossWeight: safeStr(originalData.grossWeight),
//             vesselNameOrFlightNo: safeStr(originalData.operatingAirlines),
//             shippingLineOrAirlineName: safeStr(originalData.shippingLineOrAirlineName),
//             shippingBillNo: safeStr(originalData.shippingBillNo),
//             shippingDate: safeStr(originalData.shippingDate),
//             blOrAwbNo: safeStr(originalData.awbNo),
//             narration: safeStr(originalData.narration),
//         };

//         setForm(loaded);
//         // Clear dirty when fresh data loads (mirrors MainInvoice handleInvoiceChange)
//         setDirtyData({});
//     }, [originalData]);

//     // ── Field handler — updates local form + notifies parent ─────────────────
//     const set = useCallback(
//         (field) => (e) => {
//             const value = typeof e === "object" && e?.target ? e.target.value : e;
//             setForm((prev) => ({ ...prev, [field]: value }));
//             markDirty(field, value);
//         },
//         [markDirty]
//     );

//     // ── Boolean toggle ────────────────────────────────────────────────────────
//     const toggle = useCallback(
//         (field) => () => {
//             setForm((prev) => {
//                 const newValue = !prev[field];
//                 markDirty(field, newValue);
//                 return { ...prev, [field]: newValue };
//             });
//         },
//         [markDirty]
//     );

//     // ── Accordion open/close (purely local UI — not dirty) ───────────────────
//     const toggleOpen = useCallback(
//         (key) => () => setOpenCards((prev) => ({ ...prev, [key]: !prev[key] })),
//         []
//     );

//     // ── DocTrack field change helper ──────────────────────────────────────────
//     const setDocField = useCallback(
//         (field) => (v) => {
//             setForm((prev) => ({ ...prev, [field]: v }));
//             markDirty(field, v);
//         },
//         [markDirty]
//     );

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <div className="h-[calc(100vh-15vh)] flex flex-col bg-gray-50">

//             {/* ── Invoice meta strip (shown when data is available) ── */}
//             <header className="flex-shrink-0 z-20 bg-white border-b border-gray-100 shadow-sm">
//                 <AnimatePresence>
//                     {originalData && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="flex items-center gap-5 px-6 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto"
//                         >
//                             <MetaPill label="Invoice" value={originalData.invoiceNo} />
//                             <MetaPill label="Date" value={originalData.invoiceDate?.slice(0, 10)} />
//                             <MetaPill label="Buyer" value={originalData?.customer?.name} />
//                             <MetaPill label="Country" value={originalData?.customer?.country} />
//                             <MetaPill label="Qty" value={originalData.totalQuantity} />
//                             <MetaPill label="Amount" value={originalData.totalAmount} />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </header>

//             {/* ── Empty state ── */}
//             {!selectedInvoiceId && (
//                 <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
//                     <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
//                         <FileText size={28} className="text-slate-400" />
//                     </div>
//                     <p className="text-slate-600 font-semibold text-sm">Select an invoice to get started</p>
//                     <p className="text-slate-400 text-xs mt-1">Choose an Invoice from the dropdown above</p>
//                 </div>
//             )}

//             {/* ── Loading ── */}
//             {selectedInvoiceId && invoiceFetching && (
//                 <div className="flex-1 flex flex-col items-center justify-center">
//                     <Loader2 size={28} className="animate-spin text-[#003366] mb-3" />
//                     <p className="text-slate-500 text-sm font-medium">Fetching invoice details…</p>
//                 </div>
//             )}

//             {/* ── SCROLLABLE BODY ── */}
//             {selectedInvoiceId && !invoiceFetching && (
//                 <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-8 pt-4 space-y-5">
//                     <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">

//                         {/* Bill Details */}
//                         <SectionHeading icon={FileText} title="Bill Details" />
//                         <FieldGrid>
//                             <InputBox
//                                 title="Shipping Bill No."
//                                 inputFor="shippingBillNo"
//                                 placeholder="Enter Shipping Bill No."
//                                 value={form.shippingBillNo}
//                                 handleChangeFunction={set("shippingBillNo")}
//                                 isMandatory
//                             />
//                             <InputBox
//                                 title="Shipping Date"
//                                 inputFor="shippingDate"
//                                 type="date"
//                                 placeholder="DD-MM-YYYY"
//                                 value={form.shippingDate}
//                                 handleChangeFunction={set("shippingDate")}
//                                 isMandatory
//                             />
//                             <InputBox
//                                 title="B/L or AWB No."
//                                 inputFor="blOrAwbNo"
//                                 placeholder="Enter B/L or AWB No."
//                                 value={form.blOrAwbNo}
//                                 handleChangeFunction={set("blOrAwbNo")}
//                             />
//                             <InputBox
//                                 title="Dated"
//                                 inputFor="dated"
//                                 type="date"
//                                 placeholder="DD-MM-YYYY"
//                                 value={form.dated}
//                                 handleChangeFunction={set("dated")}
//                             />
//                             <div className="md:col-span-2">
//                                 <InputBox
//                                     title="Narration"
//                                     inputFor="narration"
//                                     placeholder="Enter narration..."
//                                     value={form.narration}
//                                     handleChangeFunction={set("narration")}
//                                 />
//                             </div>
//                             <InputBox
//                                 title="Gross Weight"
//                                 inputFor="grossWeight"
//                                 type="number"
//                                 isDecimalAllowed
//                                 placeholder="0.000"
//                                 value={form.grossWeight}
//                                 handleChangeFunction={set("grossWeight")}
//                                 isSufixOrPrefix="sufix"
//                                 measure="KG"
//                             />
//                             <InputBox
//                                 title="CHA"
//                                 inputFor="cha"
//                                 placeholder="Enter CHA..."
//                                 value={form.cha}
//                                 handleChangeFunction={set("cha")}
//                             />
//                         </FieldGrid>

//                         <div className="border-t border-gray-100 my-5" />

//                         {/* Vessel / Flight Details */}
//                         <SectionHeading icon={Ship} title="Vessel / Flight Details" />
//                         <FieldGrid>
//                             <InputBox
//                                 title="Vessel Name or Flight No."
//                                 inputFor="vesselNameOrFlightNo"
//                                 value={form.vesselNameOrFlightNo}
//                                 handleChangeFunction={set("vesselNameOrFlightNo")}
//                                 isInputBoxDisabled
//                             />
//                             <InputBox
//                                 title="Shipping Line or Airline Name"
//                                 inputFor="shippingLineOrAirlineName"
//                                 value={form.shippingLineOrAirlineName}
//                                 handleChangeFunction={set("shippingLineOrAirlineName")}
//                             />
//                             <InputBox
//                                 title="Destination"
//                                 inputFor="destination"
//                                 value={form.destination}
//                                 handleChangeFunction={set("destination")}
//                                 isInputBoxDisabled
//                             />
//                             <InputBox
//                                 title="No. of Packs"
//                                 inputFor="noOfPacks"
//                                 value={form.noOfPacks}
//                                 handleChangeFunction={set("noOfPacks")}
//                                 isInputBoxDisabled
//                             />
//                             <InputBox
//                                 title="Port"
//                                 inputFor="port"
//                                 value={form.port}
//                                 handleChangeFunction={set("port")}
//                                 isInputBoxDisabled
//                             />
//                             <InputBox
//                                 title="Net Weight"
//                                 inputFor="netWeight"
//                                 type="number"
//                                 isDecimalAllowed
//                                 value={form.netWeight}
//                                 handleChangeFunction={set("netWeight")}
//                                 isSufixOrPrefix="sufix"
//                                 measure="KG"
//                                 isInputBoxDisabled
//                             />
//                         </FieldGrid>

//                         <div className="border-t border-gray-100 mt-6 mb-4" />

//                         {/* Document Tracking */}
//                         <SectionHeading title="Document Tracking" />
//                         <p className="text-[11px] text-gray-400 mb-4 mt-0.5">
//                             Click the circle to mark as received · Click the row to expand details
//                         </p>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
//                             <DocTrackCard
//                                 label="EBRC RECEIVED"
//                                 checked={form.ebrcReceived}
//                                 onCheck={toggle("ebrcReceived")}
//                                 isOpen={openCards.ebrcReceived}
//                                 onToggleOpen={toggleOpen("ebrcReceived")}
//                                 dateValue={form.ebrcReceivedDate}
//                                 onDateChange={setDocField("ebrcReceivedDate")}
//                                 narrationValue={form.ebrcNarration}
//                                 onNarrationChange={setDocField("ebrcNarration")}
//                             />
//                             <DocTrackCard
//                                 label="GR RELEASE"
//                                 checked={form.grRelease}
//                                 onCheck={toggle("grRelease")}
//                                 isOpen={openCards.grRelease}
//                                 onToggleOpen={toggleOpen("grRelease")}
//                                 dateValue={form.grReleaseDate}
//                                 onDateChange={setDocField("grReleaseDate")}
//                                 narrationValue={form.grNarration}
//                                 onNarrationChange={setDocField("grNarration")}
//                             />
//                             <DocTrackCard
//                                 label="E. P. COPY"
//                                 checked={form.epCopy}
//                                 onCheck={toggle("epCopy")}
//                                 isOpen={openCards.epCopy}
//                                 onToggleOpen={toggleOpen("epCopy")}
//                                 dateValue={form.epCopyDate}
//                                 onDateChange={setDocField("epCopyDate")}
//                                 narrationValue={form.epNarration}
//                                 onNarrationChange={setDocField("epNarration")}
//                             />
//                             <DocTrackCard
//                                 label="EXPORTER COPY"
//                                 checked={form.exporterCopy}
//                                 onCheck={toggle("exporterCopy")}
//                                 isOpen={openCards.exporterCopy}
//                                 onToggleOpen={toggleOpen("exporterCopy")}
//                                 dateValue={form.exporterCopyDate}
//                                 onDateChange={setDocField("exporterCopyDate")}
//                                 narrationValue={form.exporterNarration}
//                                 onNarrationChange={setDocField("exporterNarration")}
//                             />
//                         </div>

//                     </div>
//                     <div className="h-2" />
//                 </div>
//             )}
//         </div>
//     );
// }








import React, { useState, useEffect, useCallback } from "react";
import {
    FileText, Ship, Loader2,
    Calendar, MessageSquare, ChevronDown, ChevronRight,
    CheckCircle2, Circle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import InputBox from "../components/InputBox";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const safeStr = (val) => val ?? "";
const safeNum = (val) => (val != null ? val : "");



// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon size={13} className="text-[#003366]" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#003366]">
                {title}
            </span>
        </div>
    );
}

function FieldGrid({ children, cols = 2 }) {
    return (
        <div className={`grid gap-x-6 gap-y-4 mt-3 ${cols === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {children}
        </div>
    );
}

// ─── DocTrackCard ─────────────────────────────────────────────────────────────
function DocTrackCard({
    label, checked, onCheck, isOpen, onToggleOpen,
    dateValue, onDateChange, narrationValue, onNarrationChange,
}) {
    const isFilled = !!(dateValue?.trim() && narrationValue?.trim());

    return (
        <div className={`rounded-2xl border-2 transition-all duration-200  ${checked ? "border-[#003366] bg-blue-50/30" : "border-gray-100 bg-white"}`}>
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                onClick={onToggleOpen}
            >
                <div className="flex items-center gap-2.5">
                    <div onClick={(e) => { e.stopPropagation(); onCheck(); }} className="flex-shrink-0">
                        {checked
                            ? <CheckCircle2 size={16} className="text-[#003366] transition-colors" />
                            : <Circle size={16} className="text-gray-300 hover:text-gray-400 transition-colors" />
                        }
                    </div>
                    <span className={`text-[12px] font-bold tracking-wide transition-colors ${checked ? "text-[#003366]" : "text-slate-600"}`}>
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${isFilled ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                        {isFilled ? "FILLED" : "PENDING"}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
                    <div className="pt-3 flex items-end gap-2">
                        <Calendar size={14} className="text-[#003366] flex-shrink-0 mb-2" />
                        <div className="flex-1">
                            <InputBox
                                title="Date"
                                inputFor={`${label}-date`}
                                type="date"
                                value={dateValue}
                                handleChangeFunction={(e) => onDateChange(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <MessageSquare size={14} className="text-[#003366] flex-shrink-0 mb-2" />
                        <div className="flex-1">
                            <InputBox
                                title="Narration"
                                inputFor={`${label}-narration`}
                                placeholder="Add a note..."
                                value={narrationValue}
                                handleChangeFunction={(e) => onNarrationChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── MetaPill ─────────────────────────────────────────────────────────────────
function MetaPill({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
            <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    );
}

export default function ShippingDetails({
    selectedInvoiceId,
    originalData,
    invoiceFetching,
    dirtyData,
    markDirty,
    setDirtyData,
    form,
    setform
}) {
    // const [form, setForm] = useState(makeDefaultForm());
    const [openCards, setOpenCards] = useState({
        ebrcReceived: false,
        grRelease: false,
        epCopy: false,
        exporterCopy: false,
    });

    // ── Field handler — updates local form + notifies parent ─────────────────
    const set = useCallback(
        (field) => (e) => {
            const value = typeof e === "object" && e?.target ? e.target.value : e;
            setform((prev) => ({ ...prev, [field]: value }));
            markDirty(field, value);
        },
        [markDirty]
    );

    // ── Boolean toggle ────────────────────────────────────────────────────────
    const toggle = useCallback(
        (field) => () => {
            setform((prev) => {
                const newValue = !prev[field];
                markDirty(field, newValue);
                return { ...prev, [field]: newValue };
            });
        },
        [markDirty]
    );

    // ── Accordion open/close (purely local UI — not dirty) ───────────────────
    const toggleOpen = useCallback(
        (key) => () => setOpenCards((prev) => ({ ...prev, [key]: !prev[key] })),
        []
    );

    // ── DocTrack field change helper ──────────────────────────────────────────
    const setDocField = useCallback(
        (field) => (v) => {
            setform((prev) => ({ ...prev, [field]: v }));
            markDirty(field, v);
        },
        [markDirty]
    );

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="h-[calc(100vh-15vh)] flex flex-col bg-gray-50">

            {/* ── Invoice meta strip (shown when data is available) ── */}
            <header className="flex-shrink-0 z-20 bg-white border-b border-gray-100 shadow-sm">
                <AnimatePresence>
                    {originalData && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-5 px-6 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto"
                        >
                            <MetaPill label="Invoice" value={originalData.invoiceNo} />
                            <MetaPill label="Date" value={originalData.invoiceDate?.slice(0, 10)} />
                            <MetaPill label="Buyer" value={originalData?.customer?.name} />
                            <MetaPill label="Country" value={originalData?.customer?.country} />
                            <MetaPill label="Qty" value={originalData.totalQuantity} />
                            <MetaPill label="Amount" value={originalData.totalAmount} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Empty state ── */}
            {!selectedInvoiceId && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <FileText size={28} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold text-sm">Select an invoice to get started</p>
                    <p className="text-slate-400 text-xs mt-1">Choose an Invoice from the dropdown above</p>
                </div>
            )}

            {/* ── Loading ── */}
            {selectedInvoiceId && invoiceFetching && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-[#003366] mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Fetching invoice details…</p>
                </div>
            )}

            {/* ── SCROLLABLE BODY ── */}
            {selectedInvoiceId && !invoiceFetching && (
                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-8 pt-4 space-y-5">
                    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">

                        {/* Bill Details */}
                        <SectionHeading icon={FileText} title="Bill Details" />
                        <FieldGrid>
                            <InputBox
                                title="Shipping Bill No."
                                inputFor="shippingBillNo"
                                placeholder="Enter Shipping Bill No."
                                value={form.shippingBillNo}
                                handleChangeFunction={set("shippingBillNo")}
                                isMandatory
                            />
                            <InputBox
                                title="Shipping Date"
                                inputFor="shippingDate"
                                type="date"
                                placeholder="DD-MM-YYYY"
                                value={form.shippingDate}
                                handleChangeFunction={set("shippingDate")}
                                isMandatory
                            />
                            <InputBox
                                title="B/L or AWB No."
                                inputFor="awbNo"
                                placeholder="Enter B/L or AWB No."
                                value={form.awbNo}
                                handleChangeFunction={set("awbNo")}
                            />
                            <InputBox
                                title="awb Date"
                                inputFor="awbNoDate"
                                type="date"
                                placeholder="DD-MM-YYYY"
                                value={form.awbNoDate}
                                handleChangeFunction={set("awbNoDate")}
                            />
                            <div className="md:col-span-2">
                                <InputBox
                                    title="Narration"
                                    inputFor="narration"
                                    placeholder="Enter narration..."
                                    value={form.narration}
                                    handleChangeFunction={set("narration")}
                                />
                            </div>
                            <InputBox
                                title="Gross Weight"
                                inputFor="grossWeight"
                                type="number"
                                isDecimalAllowed
                                placeholder="0.000"
                                value={form.grossWeight}
                                handleChangeFunction={set("grossWeight")}
                                isSufixOrPrefix="sufix"
                                measure="KG"
                            />
                            <InputBox
                                title="CHA"
                                inputFor="cha"
                                placeholder="Enter CHA..."
                                value={form.cha}
                                handleChangeFunction={set("cha")}
                            />
                        </FieldGrid>

                        <div className="border-t border-gray-100 my-5" />

                        {/* Vessel / Flight Details */}
                        <SectionHeading icon={Ship} title="Vessel / Flight Details" />
                        <FieldGrid>
                            <InputBox
                                title="Vessel Name or Flight No."
                                inputFor="operatingAirlines"
                                value={form.operatingAirlines}
                                handleChangeFunction={set("operatingAirlines")}
                                isInputBoxDisabled
                            />
                            <InputBox
                                title="Shipping Line or Airline Name"
                                inputFor="shippingLineOrAirlineName"
                                value={form.shippingLineOrAirlineName}
                                handleChangeFunction={set("shippingLineOrAirlineName")}
                            />
                            <InputBox
                                title="Destination"
                                inputFor="portOfFinalDestination"
                                value={form.portOfFinalDestination}
                                handleChangeFunction={set("portOfFinalDestination")}
                                isInputBoxDisabled
                            />
                            <InputBox
                                title="No. of Packs"
                                inputFor="packing"
                                value={form.packing}
                                handleChangeFunction={set("packing")}
                                isInputBoxDisabled
                            />
                            <InputBox
                                title="Port"
                                inputFor="portOfLoading"
                                value={form.portOfLoading}
                                handleChangeFunction={set("portOfLoading")}
                                isInputBoxDisabled
                            />
                            <InputBox
                                title="Net Weight"
                                inputFor="packing"
                                type="number"
                                isDecimalAllowed
                                value={form.packing}
                                handleChangeFunction={set("packing")}
                                isSufixOrPrefix="sufix"
                                measure="KG"
                                isInputBoxDisabled
                            />
                        </FieldGrid>

                        <div className="border-t border-gray-100 mt-6 mb-4" />

                        {/* Document Tracking */}
                        <SectionHeading title="Document Tracking" />
                        <p className="text-[11px] text-gray-400 mb-4 mt-0.5">
                            Click the circle to mark as received · Click the row to expand details
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                            <DocTrackCard
                                label="EBRC RECEIVED"
                                checked={form.ebrcReceived}
                                onCheck={toggle("ebrcReceived")}
                                isOpen={openCards.ebrcReceived}
                                onToggleOpen={toggleOpen("ebrcReceived")}
                                dateValue={form.ebrcReceivedDate}
                                onDateChange={setDocField("ebrcReceivedDate")}
                                narrationValue={form.ebrcNarration}
                                onNarrationChange={setDocField("ebrcNarration")}
                            />
                            <DocTrackCard
                                label="GR RELEASE"
                                checked={form.grRelease}
                                onCheck={toggle("grRelease")}
                                isOpen={openCards.grRelease}
                                onToggleOpen={toggleOpen("grRelease")}
                                dateValue={form.grReleaseDate}
                                onDateChange={setDocField("grReleaseDate")}
                                narrationValue={form.grNarration}
                                onNarrationChange={setDocField("grNarration")}
                            />
                            <DocTrackCard
                                label="E. P. COPY"
                                checked={form.epCopy}
                                onCheck={toggle("epCopy")}
                                isOpen={openCards.epCopy}
                                onToggleOpen={toggleOpen("epCopy")}
                                dateValue={form.epCopyDate}
                                onDateChange={setDocField("epCopyDate")}
                                narrationValue={form.epNarration}
                                onNarrationChange={setDocField("epNarration")}
                            />
                            <DocTrackCard
                                label="EXPORTER COPY"
                                checked={form.exporterCopy}
                                onCheck={toggle("exporterCopy")}
                                isOpen={openCards.exporterCopy}
                                onToggleOpen={toggleOpen("exporterCopy")}
                                dateValue={form.exporterCopyDate}
                                onDateChange={setDocField("exporterCopyDate")}
                                narrationValue={form.exporterNarration}
                                onNarrationChange={setDocField("exporterNarration")}
                            />
                        </div>

                    </div>
                    <div className="h-2" />
                </div>
            )}
        </div>
    );
}