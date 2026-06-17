
// import { useState, useEffect, useCallback } from "react";
// import {
//     ArrowLeft, FileText, Package, Truck,
//     Loader2, AlertCircle, MapPin, Phone, Mail,
//     Download, Info, UserCheck, Plus,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../utils/api";
// import { useNavigate } from "react-router-dom";
// import CustomSelect from "../components/CustomSelect";
// import InputBox from "../components/InputBox";
// import { useGetprofomainvoiceMutation, useGetprofomapartyMutation, useInvoicecreateMutation, useLazyGetalltermofpaymentQuery } from "./invoiceapi/Invoiceapislice";
// import { useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";


// // ── Shared style tokens ────────────────────────────────────────────────────────
// const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";
// const roCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[45px] flex items-center";

// const hasVal = (v) => v !== null && v !== undefined && String(v).trim() !== "";

// const isEmptyValue = (v) =>
//     v === null ||
//     v === undefined ||
//     (typeof v === "string" && v.trim() === "") ||
//     (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);


// // ── Sub-components ─────────────────────────────────────────────────────────────

// function FieldLabel({ children, required }) {
//     return (
//         <label className={labelCls}>
//             {children}
//             {required && <span className="text-red-400 ml-0.5">*</span>}
//         </label>
//     );
// }

// function PartyCard({ label, data }) {
//     console.log("wcefvef", data);

//     return (
//         <div>
//             {/* <FieldLabel>{label}</FieldLabel> */}
//             {!data ? (
//                 <div className={`${roCls} text-slate-300 italic`}>Not provided</div>
//             ) : (
//                 <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5 min-h-[42px]">


//                     <p className="text-sm font-semibold text-slate-800">{data.name}</p>
//                     {[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).length > 0 && (
//                         <div className="flex items-start gap-2 text-xs text-slate-600">
//                             <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
//                             <span>
//                                 {[data.address, data.city, data.state, data.country, data.pinCode]
//                                     .filter(Boolean).join(", ")}
//                             </span>
//                         </div>
//                     )}
//                     {data.phone && (
//                         <div className="flex items-center gap-2 text-xs text-slate-600">
//                             <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
//                             <span>{data.phone}{data.altPhone ? ` / ${data.altPhone}` : ""}</span>
//                         </div>
//                     )}
//                     {data.email && (
//                         <div className="flex items-center gap-2 text-xs text-slate-600">
//                             <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
//                             <span>{data.email}</span>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// function Section({ icon: Icon, title, subtitle, children }) {
//     return (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
//             <div className="flex items-center gap-3 mb-5">
//                 <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
//                     <Icon className="w-3.5 h-3.5 text-blue-600" />
//                 </div>
//                 <div>
//                     <h2 className="text-sm font-bold text-slate-800">{title}</h2>
//                     {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
//                 </div>
//             </div>
//             {children}
//         </div>
//     );
// }

// function Grid3({ children }) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {children}
//         </div>
//     );
// }

// export default function InvoiceGenerate() {

//     const navigate = useNavigate();
//     const [getprofomainvoice] = useGetprofomainvoiceMutation();
//     const [getprofomaparty] = useGetprofomapartyMutation();
//     const [getalltermofpayment] = useLazyGetalltermofpaymentQuery();
//     const [invoicecreate] = useInvoicecreateMutation();
//     const [getCustomerbyId] = useGetCustomerbyIdMutation();

//     // lists
//     const [proformalist, setProformalist] = useState([]);

//     // selection
//     const [proformaid, setProformaid] = useState("");

//     // raw API data (never mutated after fetch)
//     const [d, setD] = useState(null);
//     const [loadingData, setLoadingData] = useState(false);

//     // ── Editable field state (pre-filled from API, user can override) ──────────

//     // Basic
//     const [invoiceNo, setInvoiceNo] = useState("");
//     const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);

//     // Invoice Information (pre-filled)
//     const [customerparty, setcustomerparty] = useState(null)
//     const [consigneeid, setconsigneeid] = useState(null);
//     const [notifyPartyid, setnotifyPartyid] = useState(null);
//     const [contactPersonid, setcontactPersonid] = useState(null);
//     const [termpay, settermpay] = useState(null)
//     const [termsOfPayment, setTermsOfPayment] = useState("");
//     const [paymentterm, setpaymentterm] = useState("");
//     const [buyersOrderNo, setBuyersOrderNo] = useState("");
//     const [lcnumber, setLcnumber] = useState("");
//     const [lcDate, setLcDate] = useState("");
//     const [otherRef, setOtherRef] = useState("");

//     // Shipping & Delivery (pre-filled)
//     const [countryOfOrigin, setCountryOfOrigin] = useState("");
//     const [countryOfDestination, setCountryOfDestination] = useState("");
//     const [preCarriageBy, setPreCarriageBy] = useState("");
//     const [portOfLoading, setPortOfLoading] = useState("");
//     const [portOfFinalDestination, setPortOfFinalDestination] = useState("");
//     const [description, setDescription] = useState("");
//     const [airlineNo, setAirlineNo] = useState("");

//     // ui
//     const [apiError, setApiError] = useState("");
//     const [generatingPdf, setGeneratingPdf] = useState(false);


//     const prefillFromData = useCallback((data) => {
//         if (!data) return;
//         setTermsOfPayment(data.termsOfPayment?.id ?? "");
//         setpaymentterm(data.paymentterm ?? "")
//         setBuyersOrderNo(data.customerId ?? "");
//         setLcnumber(data.lcNumber ?? "");
//         setOtherRef(data.otherRefrence ?? "");
//         setCountryOfOrigin(data.countryOfOrigin ?? "");
//         setCountryOfDestination(data.countryOfDestination ?? "");
//         setPreCarriageBy(data.preCarriageBy ?? "");
//         setPortOfLoading(data.portOfLoading ?? "");
//         setPortOfFinalDestination(data.portOfFinalDestination ?? "");
//         setDescription(data.description ?? "");
//         setAirlineNo(data.operatingAirlines ?? "");
//         setconsigneeid(data.consignee.id ?? "")
//         setnotifyPartyid(data.notifyParty.id ?? "")
//         setcontactPersonid(data.contactPerson.id ?? "")
//         // reset user-only fields
//         setLcDate("");
//     }, []);

//     useEffect(() => {
//         if (!proformaid) { setD(null); return; }

//         const fetchData = async () => {
//             try {
//                 const resp = await getalltermofpayment();
//                 const data = resp?.data?.data ?? null;
//                 settermpay(data);

//             } catch (error) {
//                 console.error("Error fetching parties:", error);
//                 settermpay(null);
//             } finally {
//                 setLoadingData(false);
//             }
//         };

//         fetchData();

//     }, [proformaid])

//     useEffect(() => {
//         const fetchList = async () => {
//             try {
//                 const response = await getprofomainvoice().unwrap();
//                 setProformalist(response.data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         fetchList();
//     }, []);


//     useEffect(() => {
//         if (!proformaid) { setD(null); return; }

//         setLoadingData(true);
//         setApiError("");
//         setInvoiceNo("");

//         const fetchData = async () => {
//             try {
//                 const resp = await getprofomaparty(proformaid);
//                 const data = resp?.data?.data ?? null;
//                 setD(data);
//                 prefillFromData(data);
//             } catch (error) {
//                 console.error("Error fetching parties:", error);
//                 setD(null);
//             } finally {
//                 setLoadingData(false);
//             }
//         };

//         fetchData();
//     }, [proformaid]);


//     useEffect(() => {
//         if (!d?.customerId) return;

//         const fetchData = async () => {
//             try {
//                 const res = await getCustomerbyId(d?.customerId);
//                 const data = res.data
//                 setcustomerparty(data);
//                 console.log("customerparty", customerparty);

//             } catch (error) {
//                 console.error("Error fetching parties:", error);
//             }
//         };

//         fetchData();
//     }, [d?.customerId]);

//     const contractItems = d?.items ?? [];

//     const totalKgs = contractItems.reduce(
//         (s, i) => s + (parseFloat(i.quantity) || 0), 0
//     );

//     const totalAmount = contractItems.reduce((s, i) => {
//         const qty = parseFloat(i.quantity) || 0;
//         const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
//         return s + qty * rate;
//     }, 0);


//     // ── Validation ────────────────────────────────────────────────────────────
//     const validateForm = useCallback(() => {
//         if (!d) { setApiError("Please select a proforma invoice first."); return false; }

//         const required = [
//             { key: "Invoice Number", value: invoiceNo },
//             { key: "Invoice Date", value: invoiceDate },
//             { key: "Terms of Payment", value: termsOfPayment },
//             { key: "LC Number", value: lcnumber },
//             { key: "LC Date", value: lcDate },
//             { key: "Other Reference(s)", value: otherRef },
//             { key: "Country of Origin", value: countryOfOrigin },
//             { key: "Country of Destination", value: countryOfDestination },
//             { key: "Pre-Carriage By", value: preCarriageBy },
//             { key: "Port of Loading", value: portOfLoading },
//             { key: "Port of Final Destination", value: portOfFinalDestination },
//             { key: "Airlines / Vessel No.", value: airlineNo },
//             { key: "Consignee", value: d.consignee },
//         ];

//         for (const field of required) {
//             if (isEmptyValue(field.value)) {
//                 setApiError(`${field.key} is required.`);
//                 return false;
//             }
//         }

//         setApiError("");
//         return true;
//     }, [d, invoiceNo, invoiceDate, termsOfPayment, lcnumber, lcDate, otherRef,
//         countryOfOrigin, countryOfDestination, preCarriageBy, portOfLoading,
//         portOfFinalDestination, airlineNo]);


//     // ── Payload ───────────────────────────────────────────────────────────────
//     const buildPayload = useCallback(() => ({
//         proformaid,
//         invoiceNo,
//         invoiceDate,
//         lcnumber,
//         lcDate,
//         airline_no: airlineNo,
//         otherRef,
//         customerId: buyersOrderNo,
//         consigneeId: d.consigneeId ?? "",
//         buyerId: d.buyerId ?? "",
//         buyerDate: d.buyer?.createdAt
//             ? new Date(d.buyer.createdAt).toLocaleDateString("en-GB")
//             : "",
//         notifyPartyId: d.notifyPartyId ?? "",
//         contactPersonId: d.contactPersonId ?? "",
//         termsOfPaymentId: d.termsOfPaymentId ?? "",
//         countryOfOrigin,
//         countryOfFinalDestination: countryOfDestination,
//         preCarriageBy,
//         portOfLoading,
//         portOfFinalDestination,
//         description,
//         packing: totalKgs > 0 ? totalKgs / 25 : 0,
//         operatingAirlines: airlineNo,
//         consignee: d.consignee ?? null,
//         buyer: d.buyer ?? null,
//         notifyParty: d.notifyParty ?? null,
//         contactPerson: d.contactPerson ?? null,
//         paymentterm: paymentterm ?? null,
//         termsOfPayment: d.termsOfPayment ?? null,
//         items: contractItems.map((item) => ({
//             productId: item.productId,
//             name: item.product?.name ?? "",
//             size: item.product?.size ?? "",
//             skuCode: item.product?.skuCode ?? "",
//             quantity: parseFloat(item.quantity) || 0,
//             pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
//             totalAmount: item.totalAmount ?? 0,
//         })),
//     }), [d, proformaid, invoiceNo, invoiceDate, termsOfPayment, paymentterm, lcnumber, lcDate,
//         otherRef, buyersOrderNo, countryOfOrigin, countryOfDestination, preCarriageBy,
//         portOfLoading, portOfFinalDestination, description, airlineNo, contractItems, totalKgs]);


//     // ── PDF generation ────────────────────────────────────────────────────────
//     const handleGeneratePdf = async () => {
//         if (!validateForm()) return;

//         setGeneratingPdf(true);
//         setApiError("");

//         try {
//             // const res = await api.post(
//             //     "/proformainvoice/pdfgenerate",
//             //     buildPayload(),
//             //     { responseType: "blob" }
//             // );

//             const res = await invoicecreate({
//                 body: buildPayload(),
//             }).unwrap();

//             const blobUrl = URL.createObjectURL(
//                 new Blob([res.data], { type: "application/pdf" })
//             );
//             const link = document.createElement("a");
//             link.href = blobUrl;
//             link.download = `proforma-invoice-${invoiceNo || "draft"}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             setTimeout(() => {
//                 URL.revokeObjectURL(blobUrl);
//                 window.location.reload();
//             }, 500);
//         } catch (e) {
//             const message =
//                 e?.response?.data instanceof Blob
//                     ? await e.response.data.text().then((t) => {
//                         try { return JSON.parse(t)?.error; } catch { return t; }
//                     })
//                     : e?.response?.data?.error ?? e.message;
//             setApiError(message || "Failed to generate PDF. Please try again.");
//             setGeneratingPdf(false);
//         }
//     };

//     const canSubmit = !!d && !loadingData;

//     const handler = (setter) => (e) => setter(e.target.value);


//     // ── Render ────────────────────────────────────────────────────────────────
//     return (
//         <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">

//             {/* HEADER */}
//             <div className="flex items-center gap-4 bg-white z-10 sticky top-0 border-b border-slate-100 px-4 py-4">
//                 <button
//                     onClick={() => navigate("/invoice")}
//                     className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-100"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                 </button>

//                 <div className="flex-1">
//                     <h1 className="text-xl font-black text-slate-900 tracking-tight">
//                         Generate Invoice
//                     </h1>
//                     <p className="text-xs text-slate-400 mt-0.5">
//                         Select a  invoice — all details fill automatically and can be edited
//                     </p>
//                 </div>

//                 <div className="flex gap-3 ml-auto">
//                     <button
//                         type="button"
//                         onClick={() => navigate("/invoice")}
//                         className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-100"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleGeneratePdf}
//                         disabled={generatingPdf || !canSubmit}
//                         className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
//                     >
//                         {generatingPdf
//                             ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
//                             : <><Download className="w-3.5 h-3.5" /> Invoice PDF</>
//                         }
//                     </button>
//                 </div>
//             </div>

//             {/* SCROLLABLE CONTENT */}
//             <main className="flex-1 overflow-y-auto">
//                 <div className="mx-auto px-4 py-6 space-y-5">

//                     {/* Error Banner */}
//                     <AnimatePresence>
//                         {apiError && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -8 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0 }}
//                                 className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600"
//                             >
//                                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                                 <span className="font-medium flex-1">{apiError}</span>
//                                 <button
//                                     onClick={() => setApiError("")}
//                                     className="text-red-400 hover:text-red-600 ml-auto flex-shrink-0"
//                                 >
//                                     <Plus className="w-3.5 h-3.5 rotate-45" />
//                                 </button>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {/* ── S1: Basic Information ── */}
//                     <Section icon={Info} title="Basic Information" subtitle="Select a proforma invoice — everything else fills automatically">
//                         <Grid3>
//                             {/* Proforma Invoice Select */}
//                             <CustomSelect
//                                 label={"Select Proforma Invoice"}
//                                 placeholder="Choose proforma invoice"
//                                 options={proformalist.map((c) => ({
//                                     id: c.id,
//                                     name: c.proformaInvoiceNo,
//                                 }))}
//                                 value={proformaid}
//                                 onChange={setProformaid}
//                                 searchable
//                             />

//                             <InputBox
//                                 title="Invoice Number"
//                                 isMandatory
//                                 inputFor="invoiceNo"
//                                 value={invoiceNo}
//                                 handleChangeFunction={handler(setInvoiceNo)}
//                                 placeholder="12/05/DCS/2026"
//                                 isInputBoxDisabled={!proformaid}
//                             />

//                             <InputBox
//                                 title="Invoice Date"
//                                 isMandatory
//                                 inputFor="invoiceDate"
//                                 type="date"
//                                 value={invoiceDate}
//                                 handleChangeFunction={handler(setInvoiceDate)}
//                                 isInputBoxDisabled={!proformaid}
//                             />
//                         </Grid3>

//                         {loadingData && (
//                             <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                 Loading contract data…
//                             </div>
//                         )}
//                     </Section>

//                     {/* Sections animate in once data arrives */}
//                     <AnimatePresence>
//                         {d && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 12 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0 }}
//                                 className="space-y-5"
//                             >

//                                 {/* ── S2: Parties ── */}
//                                 {/* <Section icon={UserCheck} title="Parties" subtitle="Consignee, Notify Party & Contact Person">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <PartyCard label="Buyer" data={d.customer} />
//                                         <PartyCard label="Consignee" data={customerparty?.consignees?.find(c => c.id === consigneeid)} />
//                                         <PartyCard label="Notify Party" data={customerparty?.notifyParties?.find(n => n.id === notifyPartyid)} />
//                                         <PartyCard label="Contact Person" data={customerparty?.contactPersons?.find(c => c.id === contactPersonid)} />
//                                     </div>

//                                     <div>
//                                         <CustomSelect
//                                             label={"consignee"}
//                                             placeholder="choose consignee"
//                                             options={customerparty?.consignees?.map((e) => ({
//                                                 id: e.id,
//                                                 name: e.name
//                                             })) || []}
//                                             value={consigneeid}
//                                             onChange={setconsigneeid}
//                                             searchable

//                                         />

//                                         <CustomSelect
//                                             label={"Notify Party"}
//                                             placeholder="choose Notify Party"
//                                             options={customerparty?.notifyParties?.map((e) => ({
//                                                 id: e.id,
//                                                 name: e.name

//                                             })) || []}
//                                             value={notifyPartyid}
//                                             onChange={setnotifyPartyid}
//                                             searchable

//                                         />

//                                         <CustomSelect
//                                             label={"Contact Person"}
//                                             placeholder="choose Contact Person"
//                                             options={customerparty?.contactPersons?.map((e) => ({
//                                                 id: e.id,
//                                                 name: e.name
//                                             })) || []}
//                                             value={contactPersonid}
//                                             onChange={setcontactPersonid}
//                                             searchable

//                                         />
//                                     </div>
//                                 </Section> */}



//                                 {/* ── S2: Parties ── */}
//                                 <Section icon={UserCheck} title="Parties" subtitle="Consignee, Notify Party & Contact Person">

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                                         {/* Buyer is fixed — no dropdown needed */}
//                                         <div className="">
//                                             <FieldLabel>Buyer</FieldLabel>
//                                             <PartyCard label="Buyer" data={d.customer} />
//                                         </div>

//                                         {/* Consignee: dropdown → card */}
//                                         <div className=" space-y-2">
//                                             <CustomSelect
//                                                 label="Consignee"
//                                                 placeholder="Choose Consignee"
//                                                 options={
//                                                     customerparty?.consignees?.map((e) => ({
//                                                         id: e.id,
//                                                         name: e.name,
//                                                     })) || []
//                                                 }
//                                                 value={consigneeid}
//                                                 onChange={setconsigneeid}
//                                                 searchable
//                                             />
//                                             {consigneeid && (
//                                                 <PartyCard
//                                                     label="Selected Consignee"
//                                                     data={customerparty?.consignees?.find((c) => c.id === consigneeid)}
//                                                 />
//                                             )}

//                                             <button className="flex w-full justify-center items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-xl transition-all shadow-sm"><Plus className="w-4 h-4" />Add consignee</button>
//                                         </div>

//                                         {/* Notify Party: dropdown → card */}
//                                         <div className=" space-y-2">
//                                             <CustomSelect
//                                                 label="Notify Party"
//                                                 placeholder="Choose Notify Party"
//                                                 options={
//                                                     customerparty?.notifyParties?.map((e) => ({
//                                                         id: e.id,
//                                                         name: e.name,
//                                                     })) || []
//                                                 }
//                                                 value={notifyPartyid}
//                                                 onChange={setnotifyPartyid}
//                                                 searchable
//                                             />
//                                             {notifyPartyid && (
//                                                 <PartyCard
//                                                     label="Selected Notify Party"
//                                                     data={customerparty?.notifyParties?.find((n) => n.id === notifyPartyid)}
//                                                 />
//                                             )}

//                                             <button className="flex w-full justify-center items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-xl transition-all shadow-sm"><Plus className="w-4 h-4" />Add NotifyParty</button>

//                                         </div>

//                                         {/* Contact Person: dropdown → card */}
//                                         <div className=" space-y-2">
//                                             <CustomSelect
//                                                 label="Contact Person"
//                                                 placeholder="Choose Contact Person"
//                                                 options={
//                                                     customerparty?.contactPersons?.map((e) => ({
//                                                         id: e.id,
//                                                         name: e.name,
//                                                     })) || []
//                                                 }
//                                                 value={contactPersonid}
//                                                 onChange={setcontactPersonid}
//                                                 searchable
//                                             />
//                                             {contactPersonid && (
//                                                 <PartyCard
//                                                     label="Selected Contact Person"
//                                                     data={customerparty?.contactPersons?.find((c) => c.id === contactPersonid)}
//                                                 />
//                                             )}

//                                             <button className="flex w-full justify-center items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-xl transition-all shadow-sm"><Plus className="w-4 h-4" />Add ContactPerson</button>

//                                         </div>
//                                     </div>
//                                 </Section>


//                                 {/* ── S3: Invoice Information ── */}
//                                 <Section icon={FileText} title="Invoice Information" subtitle="Pre-filled from contract — edit as needed">
//                                     <Grid3>

//                                         <CustomSelect
//                                             label={"Terms of Payment"}
//                                             placeholder="choose Terms of Payment"
//                                             options={termpay.map((e) => ({
//                                                 id: e.id,
//                                                 name: e.name
//                                             })

//                                             )}
//                                             value={termsOfPayment}
//                                             onChange={setTermsOfPayment}
//                                             searchable

//                                         />

//                                         <CustomSelect
//                                             label={"Payment term"}
//                                             placeholder="choose payment term"
//                                             options={[
//                                                 { id: 'CIF', name: 'CIF' },
//                                                 { id: 'CFR', name: 'CFR' },
//                                                 { id: 'CPT', name: 'CPT' },
//                                             ]}
//                                             value={paymentterm}
//                                             onChange={setpaymentterm}
//                                             searchable
//                                         />

//                                         <InputBox
//                                             title="Buyer's Order No."
//                                             isMandatory
//                                             inputFor="buyersOrderNo"
//                                             value={buyersOrderNo}
//                                             handleChangeFunction={handler(setBuyersOrderNo)}
//                                             placeholder="Enter buyer order no."
//                                         />

//                                         <InputBox
//                                             title="LC Number"
//                                             isMandatory
//                                             inputFor="lcnumber"
//                                             value={lcnumber}
//                                             handleChangeFunction={handler(setLcnumber)}
//                                             placeholder="Enter LC / No."
//                                         />

//                                         <InputBox
//                                             title="LC Date"
//                                             isMandatory
//                                             inputFor="lcDate"
//                                             type="date"
//                                             value={lcDate}
//                                             handleChangeFunction={handler(setLcDate)}
//                                         />

//                                         <InputBox
//                                             title="Other Reference(s)"
//                                             isMandatory
//                                             inputFor="otherRef"
//                                             value={otherRef}
//                                             handleChangeFunction={handler(setOtherRef)}
//                                             placeholder="Enter reference"
//                                         />
//                                     </Grid3>
//                                 </Section>

//                                 {/* ── S4: Shipping & Delivery ── */}
//                                 <Section icon={Truck} title="Shipping & Delivery" subtitle="Pre-filled from contract — edit as needed">
//                                     <Grid3>
//                                         <InputBox
//                                             title="Country of Origin"
//                                             isMandatory
//                                             inputFor="countryOfOrigin"
//                                             value={countryOfOrigin}
//                                             handleChangeFunction={handler(setCountryOfOrigin)}
//                                             placeholder="e.g. India"
//                                         />

//                                         <InputBox
//                                             title="Country of Destination"
//                                             isMandatory
//                                             inputFor="countryOfDestination"
//                                             value={countryOfDestination}
//                                             handleChangeFunction={handler(setCountryOfDestination)}
//                                             placeholder="e.g. USA"
//                                         />

//                                         {/* <InputBox
//                                             title="Pre-Carriage By"
//                                             isMandatory
//                                             inputFor="preCarriageBy"
//                                             value={preCarriageBy}
//                                             handleChangeFunction={handler(setPreCarriageBy)}
//                                             placeholder="e.g. Truck"
//                                         /> */}

//                                         <CustomSelect
//                                             label="Pre-Carriage By"
//                                             options={[{ id: 'Sea', name: 'Sea' }, { id: 'Air', name: 'Air' }, { id: 'Road', name: 'Road' }]}
//                                             value={preCarriageBy}
//                                             onChange={setPreCarriageBy}
//                                             searchable={false}
//                                         />

//                                         <InputBox
//                                             title="Port of Loading"
//                                             isMandatory
//                                             inputFor="portOfLoading"
//                                             value={portOfLoading}
//                                             handleChangeFunction={handler(setPortOfLoading)}
//                                             placeholder="e.g. JNPT Mumbai"
//                                         />


//                                         <InputBox
//                                             title="Port of Final Destination"
//                                             isMandatory
//                                             inputFor="portOfFinalDestination"
//                                             value={portOfFinalDestination}
//                                             handleChangeFunction={handler(setPortOfFinalDestination)}
//                                             placeholder="e.g. New York"
//                                         />

//                                         {/* Packing Details — derived, read-only display */}
//                                         <div>
//                                             <FieldLabel required>Packing Details</FieldLabel>
//                                             <div className={`${roCls} ${totalKgs > 0 ? "text-slate-800" : "text-slate-300 italic"}`}>
//                                                 {totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"}
//                                             </div>
//                                         </div>

//                                         <InputBox
//                                             title="Description of Goods"
//                                             inputFor="description"
//                                             value={description}
//                                             handleChangeFunction={handler(setDescription)}
//                                             placeholder="Enter description"
//                                         />

//                                         <InputBox
//                                             title="Airlines / Vessel No."
//                                             isMandatory
//                                             inputFor="airlineNo"
//                                             value={airlineNo}
//                                             handleChangeFunction={handler(setAirlineNo)}
//                                             placeholder="Enter Airline / Vessel No."
//                                         />
//                                     </Grid3>
//                                 </Section>

//                                 {/* ── S5: Products ── */}
//                                 <Section icon={Package} title="Product Details" subtitle="Products from contract">

//                                     {/* Column headers */}
//                                     <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
//                                         {["Product", "Size", "Qty (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
//                                             <p key={i} className={labelCls}>{h}</p>
//                                         ))}
//                                     </div>

//                                     {contractItems.length === 0 ? (
//                                         <p className="text-sm text-slate-300 italic py-4 text-center">
//                                             No products on this contract
//                                         </p>
//                                     ) : (
//                                         <div className="space-y-3">
//                                             {contractItems.map((item, i) => {
//                                                 const prod = item.product;
//                                                 const qty = parseFloat(item.quantity) || 0;
//                                                 const rate = parseFloat(item.pricePerKg ?? prod?.pricePerKg) || 0;
//                                                 const total = qty * rate;
//                                                 return (
//                                                     <motion.div
//                                                         key={item.id ?? i}
//                                                         initial={{ opacity: 0, x: -10 }}
//                                                         animate={{ opacity: 1, x: 0 }}
//                                                         className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-start"
//                                                     >
//                                                         <div className={`${roCls} flex-col !items-start text-slate-800`}>
//                                                             <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
//                                                         </div>
//                                                         <div className={`${roCls} justify-end text-slate-800`}>
//                                                             {prod?.size ?? "—"}
//                                                         </div>
//                                                         <div className={`${roCls} justify-end ${qty === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
//                                                             {qty === 0 ? "—" : qty.toLocaleString()}
//                                                         </div>
//                                                         <div className={`${roCls} justify-end ${rate === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
//                                                             {rate === 0 ? "—" : rate.toFixed(2)}
//                                                         </div>
//                                                         <div className={`${roCls} justify-end font-bold ${total === 0 ? "text-slate-300 italic" : "text-slate-700"}`}>
//                                                             {total === 0 ? "—" : total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                                                         </div>
//                                                     </motion.div>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}

//                                     {/* Totals footer */}
//                                     <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                                         <div className="flex gap-5 text-sm">
//                                             <span className="text-slate-500">
//                                                 Total KGS: <span className="font-black text-slate-800">{totalKgs.toLocaleString()}</span>
//                                             </span>
//                                             <span className="text-slate-500">
//                                                 Rows: <span className="font-black text-slate-800">{contractItems.length}</span>
//                                             </span>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className={labelCls}>Invoice Value</p>
//                                             <p className="text-2xl font-black text-[#003366]">
//                                                 US$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </Section>

//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                 </div>
//             </main>



//         </div>
//     );
// }


import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft, FileText, Package, Truck,
    Loader2, AlertCircle, MapPin, Phone, Mail,
    Download, Info, UserCheck, Plus, X, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import InputBox from "../components/InputBox";
import {
    useGetprofomainvoiceMutation,
    useGetprofomapartyMutation,
    useInvoicecreateMutation,
    useLazyGetalltermofpaymentQuery,
} from "./invoiceapi/Invoiceapislice";
import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";


// ── Style tokens ──────────────────────────────────────────────────────────────
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";
const roCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[45px] flex items-center";

const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

const PARTY_TYPE_OPTIONS = [
    { id: "consignee", name: "Consignee" },
    { id: "notifyParty", name: "Notify Party" },
    { id: "contactPerson", name: "Contact Person" },
];

// ── Initial form state ────────────────────────────────────────────────────────
const INITIAL_FORM = {
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    termsOfPayment: "",
    paymentterm: "",
    buyersOrderNo: "",
    lcnumber: "",
    lcDate: "",
    otherRef: "",
    countryOfOrigin: "",
    countryOfDestination: "",
    preCarriageBy: "",
    portOfLoading: "",
    portOfFinalDestination: "",
    description: "",
    airlineNo: "",
    currency: "",
    consigneeid: null,
    notifyPartyid: null,
    contactPersonid: null,
};


// ── Sub-components ────────────────────────────────────────────────────────────


function PartyCard({ data }) {
    if (!data) return null;
    return (
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
            <p className="text-sm font-semibold text-slate-800">{data.name}</p>
            {[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).length > 0 && (
                <div className="flex items-start gap-2 text-xs text-slate-600">
                    <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).join(", ")}</span>
                </div>
            )}
            {data.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{data.phone}{data.altPhone ? ` / ${data.altPhone}` : ""}</span>
                </div>
            )}
            {data.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{data.email}</span>
                </div>
            )}
        </div>
    );
}

function Section({ icon: Icon, title, subtitle, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

function Grid3({ children }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{children}</div>;
}

// ── PartyBlock ────────────────────────────────────────────────────────────────
function PartyBlock({ label, options, value, onChange, selectedData, onAdd, loading }) {
    return (
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className={labelCls + " mb-0"}>{label}</span>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1.5 text-[10px] gap-2 bg-[#003366] font-bold text-white hover:bg-[#004080] hover:text-white px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-3 h-3" />
                    Add New
                </button>
            </div>

            <CustomSelect
                placeholder={loading ? "Loading…" : `Choose ${label}`}
                options={options}
                value={value}
                onChange={onChange}
                searchable
            />

            {value && selectedData ? (
                <PartyCard data={selectedData} />
            ) : (
                <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 text-xs text-slate-300 italic">
                    No {label.toLowerCase()} selected
                </div>
            )}
        </div>
    );
}


const EMPTY_PARTY_FORM = {
    name: "", email: "", phone: "", altPhone: "",
    address: "", city: "", state: "", country: "",
    pinCode: "", usciNo: "",
};

function AddPartyModal({ initialType, customerId, onClose, onSuccess }) {
    const [addCustomerParty, { isLoading, isError, isSuccess, error }] = useAddCustomerPartyMutation();

    const [partyType, setPartyType] = useState(initialType || "consignee");
    const [partyForm, setPartyForm] = useState(EMPTY_PARTY_FORM);
    const [localError, setLocalError] = useState("");

    const fh = (key) => (e) => setPartyForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async () => {
        if (!partyForm.name.trim()) { setLocalError("Name is required."); return; }
        setLocalError("");
        try {
            await addCustomerParty({
                type: partyType,
                customerId,
                data: { ...partyForm },
            }).unwrap();
        } catch (_) { /* isError handles display */ }
    };

    useEffect(() => {
        if (isSuccess) {
            const t = setTimeout(() => { onSuccess(); onClose(); }, 900);
            return () => clearTimeout(t);
        }
    }, [isSuccess]);

    const serverError = error?.data?.message ?? error?.data?.error ?? null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 16 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[92vh] flex flex-col"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Add Party</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">New entry will be linked to this customer</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <CustomSelect
                        label="Party Type"
                        placeholder="Select party type"
                        options={PARTY_TYPE_OPTIONS}
                        value={partyType}
                        onChange={setPartyType}
                    />

                    <InputBox
                        title="Name"
                        isMandatory
                        inputFor="partyName"
                        value={partyForm.name}
                        handleChangeFunction={fh("name")}
                        placeholder="Enter party name"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <InputBox
                            title="Phone"
                            inputFor="partyPhone"
                            value={partyForm.phone}
                            handleChangeFunction={fh("phone")}
                            placeholder="+91 98765 43210"
                        />
                        <InputBox
                            title="Alt. Phone"
                            inputFor="partyAltPhone"
                            value={partyForm.altPhone}
                            handleChangeFunction={fh("altPhone")}
                            placeholder="Optional"
                        />
                    </div>

                    <InputBox
                        title="Email"
                        inputFor="partyEmail"
                        value={partyForm.email}
                        handleChangeFunction={fh("email")}
                        placeholder="email@example.com"
                    />

                    <InputBox
                        title="Address"
                        inputFor="partyAddress"
                        value={partyForm.address}
                        handleChangeFunction={fh("address")}
                        placeholder="Street address"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <InputBox
                            title="City"
                            inputFor="partyCity"
                            value={partyForm.city}
                            handleChangeFunction={fh("city")}
                            placeholder="City"
                        />
                        <InputBox
                            title="State"
                            inputFor="partyState"
                            value={partyForm.state}
                            handleChangeFunction={fh("state")}
                            placeholder="State"
                        />
                        <InputBox
                            title="Country"
                            inputFor="partyCountry"
                            value={partyForm.country}
                            handleChangeFunction={fh("country")}
                            placeholder="Country"
                        />
                        <InputBox
                            title="Pin / ZIP Code"
                            inputFor="partyPinCode"
                            value={partyForm.pinCode}
                            handleChangeFunction={fh("pinCode")}
                            placeholder="Pin code"
                        />
                    </div>

                    <InputBox
                        title="USCI No."
                        inputFor="partyUsciNo"
                        value={partyForm.usciNo}
                        handleChangeFunction={fh("usciNo")}
                        placeholder="USCI number"
                    />

                    {localError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-600">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{localError}</span>
                        </div>
                    )}

                    {isError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-600">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{serverError ?? "Failed to add party. Please try again."}</span>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-xs text-green-600">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Party added successfully! Closing…</span>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 px-5 py-4 border-t border-slate-100 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || isSuccess}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                        {isLoading
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                            : isSuccess
                                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
                                : "Add Party"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function InvoiceGenerate() {
    const navigate = useNavigate();

    // ── RTK Query hooks ───────────────────────────────────────────────────────
    const [getprofomainvoice, { isLoading: loadingProformaList }] = useGetprofomainvoiceMutation();
    const [getprofomaparty, { isLoading: loadingPartyData, isError: partyFetchError }] = useGetprofomapartyMutation();
    const [getalltermofpayment, { isLoading: loadingTerms }] = useLazyGetalltermofpaymentQuery();
    const [invoicecreate, { isLoading: generatingPdf, isError: pdfError, isSuccess: pdfSuccess }] = useInvoicecreateMutation();
    const [getCustomerbyId, { isLoading: loadingCustomer }] = useGetCustomerbyIdMutation();

    // ── Non-form state ────────────────────────────────────────────────────────
    const [proformalist, setProformalist] = useState([]);
    const [proformaid, setProformaid] = useState("");
    const [d, setD] = useState(null);             // raw proforma party data
    const [customerparty, setcustomerparty] = useState(null);
    const [termpay, settermpay] = useState([]);
    const [apiError, setApiError] = useState("");
    const [modalSection, setModalSection] = useState(null); // null | "consignee" | "notifyParty" | "contactPerson"

    // ── Single consolidated form state ────────────────────────────────────────
    const [form, setForm] = useState(INITIAL_FORM);

    // Generic updater — handles both input events and direct values (from CustomSelect)
    const setField = useCallback((key) => (valOrEvent) => {
        const value = valOrEvent?.target ? valOrEvent.target.value : valOrEvent;
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);


    // ── Prefill from proforma data ────────────────────────────────────────────
    const prefillFromData = useCallback((data) => {
        if (!data) return;
        setForm((prev) => ({
            ...prev,
            termsOfPayment: data.termsOfPayment?.id ?? "",
            paymentterm: data.invoicepaymentterm ?? "",
            buyersOrderNo: data.customerId ?? "",
            lcnumber: data.lcNumber ?? "",
            lcDate: data.lcDate,
            otherRef: data.otherRefrence ?? "",
            countryOfOrigin: data.countryOfOrigin ?? "",
            countryOfDestination: data.countryOfDestination ?? "",
            preCarriageBy: data.preCarriageBy ?? "",
            portOfLoading: data.portOfLoading ?? "",
            portOfFinalDestination: data.portOfFinalDestination ?? "",
            description: data.description ?? "",
            airlineNo: data.operatingAirlines ?? "",
            consigneeid: data.consignee?.id ?? null,
            notifyPartyid: data.notifyParty?.id ?? null,
            contactPersonid: data.contactPerson?.id ?? null,
            currency:data.currency,
        }));
    }, []);


    // ── Data fetching ─────────────────────────────────────────────────────────

    // Fetch proforma list on mount
    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await getprofomainvoice().unwrap();
                setProformalist(response.data);

            } catch (e) { console.error(e); }
        };
        fetchList();
    }, []);

    // Fetch terms of payment when a proforma is selected
    useEffect(() => {
        if (!proformaid) return;
        const fetchTerms = async () => {
            try {
                const resp = await getalltermofpayment();
                settermpay(resp?.data?.data ?? []);
            } catch (e) { console.error(e); }
        };
        fetchTerms();
    }, [proformaid]);

    // Fetch proforma party data when proforma changes
    useEffect(() => {
        if (!proformaid) { setD(null); return; }
        setApiError("");
        setForm((prev) => ({ ...prev, invoiceNo: "" }));

        const fetchParty = async () => {
            try {
                const resp = await getprofomaparty(proformaid);
                const data = resp?.data?.data ?? null;
                setD(data);
                prefillFromData(data);
            } catch (e) { console.error(e); setD(null); }
        };
        fetchParty();
    }, [proformaid]);

    // Fetch customer party details when customer changes
    useEffect(() => {
        if (!d?.customerId) return;
        const fetchCustomer = async () => {
            try {
                const res = await getCustomerbyId(d.customerId);
                setcustomerparty(res.data);
            } catch (e) { console.error(e); }
        };
        fetchCustomer();
    }, [d?.customerId]);


    // ── Derived values ────────────────────────────────────────────────────────
    const contractItems = d?.items ?? [];
    const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalAmount = contractItems.reduce((s, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + qty * rate;
    }, 0);


    // ── Validation ────────────────────────────────────────────────────────────
    const validateForm = useCallback(() => {
        const {
            invoiceNo, invoiceDate, termsOfPayment, lcnumber, lcDate,
            otherRef, countryOfOrigin, countryOfDestination,
            preCarriageBy, portOfLoading, portOfFinalDestination, airlineNo, paymentterm, currency,
        } = form;

        if (!d) { setApiError("Please select a proforma invoice first."); return false; }

        const required = [
            { key: "Invoice Number", value: invoiceNo },
            { key: "Invoice Date", value: invoiceDate },
            { key: "Terms of Payment", value: termsOfPayment },
            { key: "LC Number", value: lcnumber },
            { key: "LC Date", value: lcDate },
            { key: "Other Reference(s)", value: otherRef },
            { key: "Country of Origin", value: countryOfOrigin },
            { key: "Country of Destination", value: countryOfDestination },
            { key: "Pre-Carriage By", value: preCarriageBy },
            { key: "Port of Loading", value: portOfLoading },
            { key: "Port of Final Destination", value: portOfFinalDestination },
            { key: "Airlines / Vessel No.", value: airlineNo },
            { key: "Consignee", value: d.consignee },
            { key: "Payment Term", value: paymentterm },
            { key: "Currency", value: currency }
        ];

        for (const field of required) {
            if (isEmptyValue(field.value)) {
                setApiError(`${field.key} is required.`);
                return false;
            }
        }

        setApiError("");
        return true;
    }, [d, form]);


    // ── Payload builder ───────────────────────────────────────────────────────
    const buildPayload = useCallback(() => {
        const {
            invoiceNo, invoiceDate, termsOfPayment, paymentterm,
            lcnumber, lcDate, otherRef, buyersOrderNo,
            countryOfOrigin, countryOfDestination, preCarriageBy,
            portOfLoading, portOfFinalDestination, description,
            airlineNo, currency, consigneeid, notifyPartyid, contactPersonid,
        } = form;

        return {
            proformaid,
            invoiceNo,
            invoiceDate,
            lcnumber,
            lcDate,
            airline_no: airlineNo,
            otherRef,
            customerId: buyersOrderNo,
            buyerId: d.buyerId ?? "",
            buyerDate: d.buyer?.createdAt
                ? new Date(d.buyer.createdAt).toLocaleDateString("en-GB")
                : "",
            consigneeId: consigneeid ?? "",
            notifyPartyId: notifyPartyid ?? "",
            contactPersonId: contactPersonid ?? "",
            termsOfPaymentId: termsOfPayment ?? "",
            countryOfOrigin,
            countryOfFinalDestination: countryOfDestination,
            preCarriageBy,
            portOfLoading,
            portOfFinalDestination,
            description,
            totalKgs,
            packing: String(totalKgs > 0 ? totalKgs / 25 : 0),
            operatingAirlines: airlineNo,
            buyer: d.buyer ?? null,
            consignee: customerparty?.consignees?.find((c) => c.id === consigneeid) ?? null,
            notifyParty: customerparty?.notifyParties?.find((n) => n.id === notifyPartyid) ?? null,
            contactPerson: customerparty?.contactPersons?.find((c) => c.id === contactPersonid) ?? null,
            invoicepaymentterm: paymentterm ?? null,
            termsOfPayment: termpay?.find((c) => c.id === termsOfPayment) ?? null,
            currency: currency ?? null,
            totalAmount: totalAmount,
            items: contractItems.map((item) => ({
                productId: item.productId,
                name: item.product?.name ?? "",
                size: item.product?.size ?? "",
                skuCode: item.product?.skuCode ?? "",
                quantity: parseFloat(item.quantity) || 0,
                pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
                totalAmount: item.totalAmount ?? 0,
            })),
        };
    }, [d, form, proformaid, contractItems, totalKgs, termpay, customerparty]);


    const handleGeneratePdf = async () => {
        if (!validateForm()) return;
        setApiError("");
        try {
            const res = await invoicecreate({ body: buildPayload() }).unwrap();
            const blobUrl = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `Invoice-${form.invoiceNo || "draft"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => { URL.revokeObjectURL(blobUrl); window.location.reload(); }, 500);
        } catch (e) {
            setApiError(e?.data?.error ?? e?.message ?? "Failed to generate PDF.");
        }
    };

    // Refresh customer parties after modal save
    const handlePartyAdded = async () => {
        if (!d?.customerId) return;
        try {
            const res = await getCustomerbyId(d.customerId);
            setcustomerparty(res.data);
        } catch (e) { console.error(e); }
    };

    const loadingData = loadingPartyData || loadingCustomer;
    const canSubmit = !!d && !loadingData && !generatingPdf;


    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">

            {/* ── HEADER ── */}
            <div className="flex items-center gap-4 bg-white z-10 sticky top-0 border-b border-slate-100 px-4 py-4">
                <button
                    onClick={() => navigate("/invoice")}
                    className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-100 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Generate Invoice</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Select a proforma invoice — all details fill automatically and can be edited
                    </p>
                </div>
                <div className="flex gap-3 ml-auto">
                    <button
                        type="button"
                        onClick={() => navigate("/invoice")}
                        className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleGeneratePdf}
                        disabled={!canSubmit}
                        className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        {generatingPdf
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                            : <><Download className="w-3.5 h-3.5" /> Invoice PDF</>
                        }
                    </button>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto px-4 py-6 space-y-5">

                    {/* Error Banner */}
                    <AnimatePresence>
                        {(apiError || partyFetchError || pdfError) && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium flex-1">
                                    {apiError || (partyFetchError ? "Failed to load party data." : "Failed to generate PDF.")}
                                </span>
                                <button
                                    onClick={() => setApiError("")}
                                    className="text-red-400 hover:text-red-600 ml-auto cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success Banner */}
                    <AnimatePresence>
                        {pdfSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-600"
                            >
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">Invoice PDF generated successfully!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* ── S1: Basic Information ── */}
                    <Section
                        icon={Info}
                        title="Basic Information"
                        subtitle="Select a proforma invoice — everything else fills automatically"
                    >
                        <Grid3>
                            <CustomSelect
                                label="Select Proforma Invoice"
                                placeholder={loadingProformaList ? "Loading…" : "Choose proforma invoice"}
                                options={proformalist.map((c) => ({ id: c.id, name: c.proformaInvoiceNo }))}
                                value={proformaid}
                                onChange={setProformaid}
                                searchable
                            />
                            <InputBox
                                title="Invoice Number"
                                isMandatory
                                inputFor="invoiceNo"
                                value={form.invoiceNo}
                                handleChangeFunction={setField("invoiceNo")}
                                placeholder="12/05/DCS/2026"
                                isInputBoxDisabled={!proformaid}
                            />
                            <InputBox
                                title="Invoice Date"
                                isMandatory
                                inputFor="invoiceDate"
                                type="date"
                                value={form.invoiceDate}
                                handleChangeFunction={setField("invoiceDate")}
                                isInputBoxDisabled={!proformaid}
                            />
                        </Grid3>

                        {loadingData && (
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading contract data…
                            </div>
                        )}
                    </Section>


                    {/* ── Sections that require proforma data ── */}
                    <AnimatePresence>
                        {d && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-5"
                            >

                                {/* ── S2: Parties ── */}
                                <Section
                                    icon={UserCheck}
                                    title="Parties"
                                    subtitle="Buyer is fixed; select or add Consignee, Notify Party & Contact Person"
                                >
                                    {/* Buyer — read-only */}
                                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                                        <span className={labelCls + " mb-0"}>Buyer</span>
                                        {d.customer
                                            ? <PartyCard data={d.customer} />
                                            : (
                                                <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 text-xs text-slate-300 italic">
                                                    No buyer data
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Consignee */}
                                        <PartyBlock
                                            label="Consignee"
                                            options={customerparty?.consignees?.map((e) => ({ id: e.id, name: e.name })) ?? []}
                                            value={form.consigneeid}
                                            onChange={setField("consigneeid")}
                                            selectedData={customerparty?.consignees?.find((c) => c.id === form.consigneeid)}
                                            onAdd={() => setModalSection("consignee")}
                                            loading={loadingCustomer}
                                        />

                                        {/* Notify Party */}
                                        <PartyBlock
                                            label="Notify Party"
                                            options={customerparty?.notifyParties?.map((e) => ({ id: e.id, name: e.name })) ?? []}
                                            value={form.notifyPartyid}
                                            onChange={setField("notifyPartyid")}
                                            selectedData={customerparty?.notifyParties?.find((n) => n.id === form.notifyPartyid)}
                                            onAdd={() => setModalSection("notifyParty")}
                                            loading={loadingCustomer}
                                        />

                                        {/* Contact Person */}
                                        <PartyBlock
                                            label="Contact Person"
                                            options={customerparty?.contactPersons?.map((e) => ({ id: e.id, name: e.name })) ?? []}
                                            value={form.contactPersonid}
                                            onChange={setField("contactPersonid")}
                                            selectedData={customerparty?.contactPersons?.find((c) => c.id === form.contactPersonid)}
                                            onAdd={() => setModalSection("contactPerson")}
                                            loading={loadingCustomer}
                                        />
                                    </div>
                                </Section>


                                {/* ── S3: Invoice Information ── */}
                                <Section
                                    icon={FileText}
                                    title="Invoice Information"
                                    subtitle="Pre-filled from contract — edit as needed"
                                >
                                    <Grid3>
                                        <CustomSelect
                                            label="Terms of Payment"
                                            placeholder={loadingTerms ? "Loading…" : "Choose Terms of Payment"}
                                            options={(termpay ?? []).map((e) => ({ id: e.id, name: e.name }))}
                                            value={form.termsOfPayment}
                                            onChange={setField("termsOfPayment")}
                                            searchable
                                        />
                                        <CustomSelect
                                            label="Payment Term"
                                            placeholder="Choose payment term"
                                            options={[
                                                { id: "CIF", name: "CIF" },
                                                { id: "CFR", name: "CFR" },
                                                { id: "CPT", name: "CPT" },
                                            ]}
                                            value={form.paymentterm}
                                            onChange={setField("paymentterm")}
                                        />
                                        <InputBox
                                            title="Buyer's Order No."
                                            isMandatory
                                            inputFor="buyersOrderNo"
                                            value={form.buyersOrderNo}
                                            handleChangeFunction={setField("buyersOrderNo")}
                                            placeholder="Enter buyer order no."
                                        />
                                        <InputBox
                                            title="LC Number"
                                            isMandatory
                                            inputFor="lcnumber"
                                            value={form.lcnumber}
                                            handleChangeFunction={setField("lcnumber")}
                                            placeholder="Enter LC / No."
                                        />
                                        <InputBox
                                            title="LC Date"
                                            isMandatory
                                            inputFor="lcDate"
                                            value={form.lcDate}
                                            handleChangeFunction={setField("lcDate")}
                                        />
                                        <InputBox
                                            title="Other Reference(s)"
                                            isMandatory
                                            inputFor="otherRef"
                                            value={form.otherRef}
                                            handleChangeFunction={setField("otherRef")}
                                            placeholder="Enter reference"
                                        />
                                    </Grid3>
                                </Section>


                                {/* ── S4: Shipping & Delivery ── */}
                                <Section
                                    icon={Truck}
                                    title="Shipping & Delivery"
                                    subtitle="Pre-filled from contract — edit as needed"
                                >
                                    <Grid3>
                                        <InputBox
                                            title="Country of Origin"
                                            isMandatory
                                            inputFor="countryOfOrigin"
                                            value={form.countryOfOrigin}
                                            handleChangeFunction={setField("countryOfOrigin")}
                                            placeholder="e.g. India"
                                        />
                                        <InputBox
                                            title="Country of Destination"
                                            isMandatory
                                            inputFor="countryOfDestination"
                                            value={form.countryOfDestination}
                                            handleChangeFunction={setField("countryOfDestination")}
                                            placeholder="e.g. USA"
                                        />
                                        <CustomSelect
                                            label="Pre-Carriage By"
                                            options={[
                                                { id: "Sea", name: "Sea" },
                                                { id: "Air", name: "Air" },
                                                { id: "Road", name: "Road" },
                                            ]}
                                            value={form.preCarriageBy}
                                            onChange={setField("preCarriageBy")}
                                        />
                                        <InputBox
                                            title="Port of Loading"
                                            isMandatory
                                            inputFor="portOfLoading"
                                            value={form.portOfLoading}
                                            handleChangeFunction={setField("portOfLoading")}
                                            placeholder="e.g. JNPT Mumbai"
                                        />
                                        <InputBox
                                            title="Port of Final Destination"
                                            isMandatory
                                            inputFor="portOfFinalDestination"
                                            value={form.portOfFinalDestination}
                                            handleChangeFunction={setField("portOfFinalDestination")}
                                            placeholder="e.g. New York"
                                        />
                                        <InputBox
                                            title="Description of Goods"
                                            inputFor="description"
                                            value={form.description}
                                            handleChangeFunction={setField("description")}
                                            placeholder="Enter description"
                                        />
                                        <InputBox
                                            title="Airlines / Vessel No."
                                            isMandatory
                                            inputFor="airlineNo"
                                            value={form.airlineNo}
                                            handleChangeFunction={setField("airlineNo")}
                                            placeholder="Enter Airline / Vessel No."
                                        />
                                        <CustomSelect
                                            label="Currency"
                                            options={[
                                                { id: "USD", name: "USD" },
                                                { id: "INR", name: "INR" },
                                                { id: "EUR", name: "EUR" },
                                            ]}
                                            value={form.currency}
                                            onChange={setField("currency")}
                                        />
                                        <InputBox
                                            title="Carton Weight"
                                            value="25"
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="Marks and Container NO."
                                            value={`001 to ${totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"}`}
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="NO. of Packing Details"
                                            value={totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"}
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="Shipping Marks"
                                            value="DCS"
                                            isInputBoxDisabled
                                        />
                                    </Grid3>
                                </Section>


                                {/* ── S5: Products ── */}
                                <Section icon={Package} title="Product Details" subtitle="Products from contract">
                                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
                                        {["Product", "Size", "Qty (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
                                            <p key={i} className={labelCls}>{h}</p>
                                        ))}
                                    </div>

                                    {contractItems.length === 0 ? (
                                        <p className="text-sm text-slate-300 italic py-4 text-center">
                                            No products on this contract
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {contractItems.map((item, i) => {
                                                const prod = item.product;
                                                const qty = parseFloat(item.quantity) || 0;
                                                const rate = parseFloat(item.pricePerKg ?? prod?.pricePerKg) || 0;
                                                const total = qty * rate;
                                                return (
                                                    <motion.div
                                                        key={item.id ?? i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-start"
                                                    >
                                                        <div className={`${roCls} flex-col !items-start text-slate-800`}>
                                                            <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
                                                        </div>
                                                        <div className={`${roCls} justify-end text-slate-800`}>
                                                            {prod?.size ?? "—"}
                                                        </div>
                                                        <div className={`${roCls} justify-end ${qty === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
                                                            {qty === 0 ? "—" : qty.toLocaleString()}
                                                        </div>
                                                        <div className={`${roCls} justify-end ${rate === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
                                                            {rate === 0 ? "—" : rate.toFixed(2)}
                                                        </div>
                                                        <div className={`${roCls} justify-end font-bold ${total === 0 ? "text-slate-300 italic" : "text-slate-700"}`}>
                                                            {total === 0 ? "—" : total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div className="flex gap-5 text-sm">
                                            <span className="text-slate-500">
                                                Total KGS:{" "}
                                                <span className="font-black text-slate-800">
                                                    {totalKgs.toLocaleString()}
                                                </span>
                                            </span>
                                            <span className="text-slate-500">
                                                Rows:{" "}
                                                <span className="font-black text-slate-800">
                                                    {contractItems.length}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className={labelCls}>Invoice Value</p>
                                            <p className="text-2xl font-black text-[#003366]">
                                                US$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </Section>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main>


            {/* ── Add Party Modal ── */}
            <AnimatePresence>
                {modalSection && (
                    <AddPartyModal
                        initialType={modalSection}
                        customerId={d?.customerId}
                        onClose={() => setModalSection(null)}
                        onSuccess={handlePartyAdded}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}