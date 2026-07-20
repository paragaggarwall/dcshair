






// import { useState, useEffect, useCallback } from "react";
// import {
//     FileText, Package, Truck,
//     Loader2, AlertCircle, MapPin, Phone, Mail,
//     Info, UserCheck, Plus, X, CheckCircle2,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import CustomSelect from "../components/CustomSelect";
// import InputBox from "../components/InputBox";

// import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";
// import toast from "react-hot-toast";
// import { useLazyGetalltermofpaymentQuery } from "./payment_productApi/payment_productApiSlice";

// // ── Style tokens ──────────────────────────────────────────────────────────────
// const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";
// const roCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[45px] flex items-center";

// const PARTY_TYPE_OPTIONS = [
//     { id: "consignee", name: "Consignee" },
//     { id: "notifyParty", name: "Notify Party" },
//     { id: "contactPerson", name: "Contact Person" },
// ];

// function PartyCard({ data }) {
//     if (!data) return null;
//     return (
//         <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
//             <p className="text-sm font-semibold text-slate-800">{data.name}</p>
//             {[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).length > 0 && (
//                 <div className="flex items-start gap-2 text-xs text-slate-600">
//                     <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
//                     <span>{[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).join(", ")}</span>
//                 </div>
//             )}
//             {data.phone && (
//                 <div className="flex items-center gap-2 text-xs text-slate-600">
//                     <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
//                     <span>{data.phone}{data.altPhone ? ` / ${data.altPhone}` : ""}</span>
//                 </div>
//             )}
//             {data.email && (
//                 <div className="flex items-center gap-2 text-xs text-slate-600">
//                     <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
//                     <span>{data.email}</span>
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
//     return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{children}</div>;
// }

// function PartyBlock({ label, options, value, onChange, selectedData, onAdd, loading }) {
//     return (
//         <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
//             <div className="flex items-center justify-between">
//                 <span className={labelCls + " mb-0"}>{label}</span>
//                 <button
//                     type="button"
//                     onClick={onAdd}
//                     className="flex items-center gap-1.5 text-[10px] bg-[#003366] font-bold text-white hover:bg-[#004080] px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
//                 >
//                     <Plus className="w-3 h-3" />
//                     Add New
//                 </button>
//             </div>
//             <CustomSelect
//                 placeholder={loading ? "Loading…" : `Choose ${label}`}
//                 options={options}
//                 value={value}
//                 onChange={onChange}
//                 searchable
//             />
//             {value && selectedData ? (
//                 <PartyCard data={selectedData} />
//             ) : (
//                 <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 text-xs text-slate-300 italic">
//                     No {label.toLowerCase()} selected
//                 </div>
//             )}
//         </div>
//     );
// }

// const EMPTY_PARTY_FORM = {
//     name: "", email: "", phone: "", altPhone: "",
//     address: "", city: "", state: "", country: "",
//     pinCode: "", usciNo: "",
// };

// function AddPartyModal({ initialType, customerId, onClose, onSuccess }) {
//     const [addCustomerParty, { isLoading, isError, isSuccess, error }] = useAddCustomerPartyMutation();
//     const [partyType, setPartyType] = useState(initialType || "consignee");
//     const [partyForm, setPartyForm] = useState(EMPTY_PARTY_FORM);
//     const [localError, setLocalError] = useState("");

//     const fh = (key) => (e) => setPartyForm((f) => ({ ...f, [key]: e.target.value }));

//     const handleSubmit = async () => {
//         if (!partyForm.name.trim()) { setLocalError("Name is required."); return; }
//         setLocalError("");
//         try {
//             await addCustomerParty({ type: partyType, customerId, data: { ...partyForm } }).unwrap();
//         } catch (_) { }
//     };

//     useEffect(() => {
//         if (isSuccess) {
//             const t = setTimeout(() => { onSuccess(); onClose(); }, 900);
//             return () => clearTimeout(t);
//         }
//     }, [isSuccess]);

//     const serverError = error?.data?.message ?? error?.data?.error ?? null;

//     return (
//         <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//             onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
//         >
//             <motion.div
//                 initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
//                 className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[92vh] flex flex-col"
//             >
//                 <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
//                     <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
//                             <UserCheck className="w-3.5 h-3.5 text-blue-600" />
//                         </div>
//                         <div>
//                             <h3 className="text-sm font-bold text-slate-800">Add Party</h3>
//                             <p className="text-[10px] text-slate-400 mt-0.5">New entry will be linked to this customer</p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} disabled={isLoading} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 cursor-pointer">
//                         <X className="w-4 h-4" />
//                     </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-5 space-y-4">
//                     <CustomSelect label="Party Type" placeholder="Select party type" options={PARTY_TYPE_OPTIONS} value={partyType} onChange={setPartyType} />
//                     <InputBox title="Name" isMandatory inputFor="partyName" value={partyForm.name} handleChangeFunction={fh("name")} placeholder="Enter party name" />
//                     <div className="grid grid-cols-2 gap-3">
//                         <InputBox title="Phone" inputFor="partyPhone" value={partyForm.phone} handleChangeFunction={fh("phone")} placeholder="+91 98765 43210" />
//                         <InputBox title="Alt. Phone" inputFor="partyAltPhone" value={partyForm.altPhone} handleChangeFunction={fh("altPhone")} placeholder="Optional" />
//                     </div>
//                     <InputBox title="Email" inputFor="partyEmail" value={partyForm.email} handleChangeFunction={fh("email")} placeholder="email@example.com" />
//                     <InputBox title="Address" inputFor="partyAddress" value={partyForm.address} handleChangeFunction={fh("address")} placeholder="Street address" />
//                     <div className="grid grid-cols-2 gap-3">
//                         <InputBox title="City" inputFor="partyCity" value={partyForm.city} handleChangeFunction={fh("city")} placeholder="City" />
//                         <InputBox title="State" inputFor="partyState" value={partyForm.state} handleChangeFunction={fh("state")} placeholder="State" />
//                         <InputBox title="Country" inputFor="partyCountry" value={partyForm.country} handleChangeFunction={fh("country")} placeholder="Country" />
//                         <InputBox title="Pin / ZIP Code" inputFor="partyPinCode" value={partyForm.pinCode} handleChangeFunction={fh("pinCode")} placeholder="Pin code" />
//                     </div>
//                     <InputBox title="USCI No." inputFor="partyUsciNo" value={partyForm.usciNo} handleChangeFunction={fh("usciNo")} placeholder="USCI number" />

//                     {localError && (
//                         <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-600">
//                             <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span>{localError}</span>
//                         </div>
//                     )}
//                     {isError && (
//                         <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-600">
//                             <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /><span>{serverError ?? "Failed to add party. Please try again."}</span>
//                         </div>
//                     )}
//                     {isSuccess && (
//                         <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-xs text-green-600">
//                             <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /><span>Party added successfully! Closing…</span>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex gap-3 px-5 py-4 border-t border-slate-100 flex-shrink-0">
//                     <button type="button" onClick={onClose} disabled={isLoading}
//                         className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer">
//                         Cancel
//                     </button>
//                     <button type="button" onClick={handleSubmit} disabled={isLoading || isSuccess}
//                         className="flex-1 flex items-center justify-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer">
//                         {isLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : isSuccess ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</> : "Add Party"}
//                     </button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// }

// export default function InvoiceDetails({
//     selectedInvoiceId,
//     originalData,
//     invoiceFetching,
//     refetch,
//     dirtyData,
//     markDirty,
//     setDirtyData,
//     form,
//     setform,
// }) {
//     // ── RTK Query hooks ───────────────────────────────────────────────────────
//     const [getalltermofpayment, { isLoading: loadingTerms }] = useLazyGetalltermofpaymentQuery();
//     const [getCustomerbyId, { isLoading: loadingCustomer }] = useGetCustomerbyIdMutation();
//     const invoiceData = form;
//     const [customerparty, setCustomerparty] = useState(null);
//     const [termpay, setTermpay] = useState([]);
//     const [modalSection, setModalSection] = useState(null);


//     useEffect(() => {
//         if (!invoiceData) return;
//         const fetchTerms = async () => {
//             try {
//                 const resp = await getalltermofpayment().unwrap();
//                 if (resp?.success) {
//                     setTermpay(resp?.data);
//                 }
//             } catch (err) {
//                 console.error(err);
//                 toast.error(err.data?.message || 'fail to fetch term of payment')
//             }
//         };
//         fetchTerms();
//     }, [invoiceData]);

//     // ── Fetch customer parties ────────────────────────────────────────────────
//     useEffect(() => {
//         const customerId = invoiceData?.customerId;
//         if (!customerId) return;
//         const fetchCustomer = async () => {
//             try {
//                 const res = await getCustomerbyId(customerId).unwrap();
//                 if (res?.success) {
//                     setCustomerparty(res.data);
//                 }

//             } catch (err) {
//                 console.error(err);
//                 toast.error(err.data?.message || "fail to fetch customerbyID")
//             }
//         };
//         fetchCustomer();
//     }, [invoiceData?.customerId]);

//     const setField = useCallback((key) => (valOrEvent) => {
//         const value = valOrEvent?.target ? valOrEvent.target.value : valOrEvent;
//         setform((prev) => ({ ...prev, [key]: value }));
//         markDirty(key, value);
//     }, [markDirty]);

//     // ── Derived values ────────────────────────────────────────────────────────
//     const contractItems = invoiceData?.items ?? [];
//     const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
//     const totalAmount = contractItems.reduce((s, i) => {
//         const qty = parseFloat(i.quantity) || 0;
//         const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
//         return s + qty * rate;
//     }, 0);

//     // ── Refresh customer parties after modal save ─────────────────────────────
//     const handlePartyAdded = async () => {
//         const customerId = invoiceData?.customerId;
//         if (!customerId) return;
//         try {
//             const res = await getCustomerbyId(customerId).unwrap();
//             if (res?.success) {
//                 setCustomerparty(res.data);
//             }
//         } catch (err) {
//             console.error(err);
//             toast.err(err.data?.message || "fail to fetch customerParty");
//         }
//     };

//     const hasInvoice = !!invoiceData && !!selectedInvoiceId;

//     if (!selectedInvoiceId) {
//         return (
//             <div className="h-[calc(100vh-15vh)] bg-slate-50 flex items-center justify-center">
//                 <div className="text-center space-y-3">
//                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
//                         <FileText className="w-6 h-6 text-slate-300" />
//                     </div>
//                     <p className="text-sm font-semibold text-slate-400">Select an invoice to view details</p>
//                     <p className="text-xs text-slate-300">Use the dropdown above to choose an invoice</p>
//                 </div>
//             </div>
//         );
//     }

//     // ── Render ────────────────────────────────────────────────────────────────
//     return (
//         <div className="h-[calc(100vh-15vh)] bg-slate-50 flex flex-col overflow-hidden">

//             {/* ── Scrollable Content ── */}
//             <main className="flex-1 overflow-y-auto">
//                 <div className="mx-auto px-4 py-6 space-y-5">

//                     {/* Loading */}
//                     {invoiceFetching && (
//                         <div className="flex items-center justify-center py-20">
//                             <div className="flex flex-col items-center gap-3">
//                                 <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//                                 <p className="text-sm text-slate-400">Loading invoice details…</p>
//                             </div>
//                         </div>
//                     )}

//                     {!invoiceFetching && hasInvoice && (
//                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

//                             {/* S1: Basic Information */}
//                             <Section icon={Info} title="Basic Information" subtitle="Core invoice identifiers">
//                                 <Grid3>
//                                     <InputBox
//                                         title="ProformaInvoice Number" isMandatory inputFor="proformaInvoice"
//                                         value={form.proformaInvoiceNo} handleChangeFunction={setField("proformaInvoice")}
//                                         placeholder="-" isInputBoxDisabled
//                                     />
//                                     <InputBox
//                                         title="Invoice Number" isMandatory inputFor="invoiceNo"
//                                         value={form.invoiceNo} handleChangeFunction={setField("invoiceNo")}
//                                         placeholder="12/05/DCS/2026" isInputBoxDisabled
//                                     />
//                                     <InputBox
//                                         title="Invoice Date" isMandatory inputFor="invoiceDate" type="date"
//                                         value={form.invoiceDate} handleChangeFunction={setField("invoiceDate")}
//                                         isInputBoxDisabled
//                                     />
//                                 </Grid3>
//                             </Section>

//                             {/* S2: Parties */}
//                             <Section icon={UserCheck} title="Parties" subtitle="Buyer is fixed; update Consignee, Notify Party & Contact Person as needed">
//                                 <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 mb-4">
//                                     <span className={labelCls + " mb-0"}>Buyer</span>
//                                     {originalData.customer
//                                         ? <PartyCard data={originalData.customer} />
//                                         : (
//                                             <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 text-xs text-slate-300 italic">
//                                                 No buyer data
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <PartyBlock
//                                         label="Consignee"
//                                         options={customerparty?.consignees?.map((e) => ({ id: e.id, name: e.name })) ?? []}
//                                         value={form.consigneeId}
//                                         onChange={setField("consigneeId")}
//                                         selectedData={customerparty?.consignees?.find((c) => c.id === form.consigneeId)}
//                                         onAdd={() => setModalSection("consignee")}
//                                         loading={loadingCustomer}
//                                     />
//                                     <PartyBlock
//                                         label="Notify Party"
//                                         options={customerparty?.notifyParties?.map((e) => ({ id: e.id, name: e.name })) ?? []}
//                                         value={form.notifyPartyId}
//                                         onChange={setField("notifyPartyId")}
//                                         selectedData={customerparty?.notifyParties?.find((n) => n.id === form.notifyPartyId)}
//                                         onAdd={() => setModalSection("notifyParty")}
//                                         loading={loadingCustomer}
//                                     />
//                                     <PartyBlock
//                                         label="Contact Person"
//                                         options={customerparty?.contactPersons?.map((e) => ({ id: e.id, name: e.name })) ?? []}
//                                         value={form.contactPersonId}
//                                         onChange={setField("contactPersonId")}
//                                         selectedData={customerparty?.contactPersons?.find((c) => c.id === form.contactPersonId)}
//                                         onAdd={() => setModalSection("contactPerson")}
//                                         loading={loadingCustomer}
//                                     />
//                                 </div>
//                             </Section>

//                             {/* S3: Invoice Information */}
//                             <Section icon={FileText} title="Invoice Information" subtitle="Payment terms and reference details">
//                                 <Grid3>
//                                     <CustomSelect
//                                         label="Terms of Payment"
//                                         placeholder={loadingTerms ? "Loading…" : "Choose Terms of Payment"}
//                                         options={(termpay ?? []).map((e) => ({ id: e.id, name: e.name }))}
//                                         value={form.termsOfPaymentId}
//                                         onChange={setField("termsOfPaymentId")}
//                                         searchable
//                                     />
//                                     <CustomSelect
//                                         label="Payment Term"
//                                         placeholder="Choose payment term"
//                                         options={[
//                                             { id: "CIF", name: "CIF" },
//                                             { id: "CFR", name: "CFR" },
//                                             { id: "CPT", name: "CPT" },
//                                         ]}
//                                         value={form.invoicepaymentterm}
//                                         onChange={setField("invoicepaymentterm")}
//                                     />
//                                     <InputBox title="LC Number" inputFor="lcnumber" value={form.lcnumber} handleChangeFunction={setField("lcnumber")} placeholder="Enter LC / No." />
//                                     <InputBox title="LC Date" inputFor="lcDate" type="date" value={form.lcDate} handleChangeFunction={setField("lcDate")} />
//                                     <InputBox title="Other Reference(s)" inputFor="otherRef" value={form.otherRefrence} handleChangeFunction={setField("otherRefrence")} placeholder="Enter reference" />
//                                 </Grid3>
//                             </Section>

//                             {/* S4: Shipping & Delivery */}
//                             <Section icon={Truck} title="Shipping & Delivery" subtitle="Origin, routing, and transport details">
//                                 <Grid3>
//                                     <InputBox title="Country of Origin" isMandatory inputFor="countryOfOrigin" value={form.countryOfOrigin} handleChangeFunction={setField("countryOfOrigin")} placeholder="e.g. India" />
//                                     <InputBox title="Country of Destination" isMandatory inputFor="countryOfDestination" value={form.countryOfDestination} handleChangeFunction={setField("countryOfDestination")} placeholder="e.g. USA" />
//                                     <CustomSelect
//                                         label="Pre-Carriage By"
//                                         options={[{ id: "Sea", name: "Sea" }, { id: "Air", name: "Air" }, { id: "Road", name: "Road" }]}
//                                         value={form.preCarriageBy}
//                                         onChange={setField("preCarriageBy")}
//                                     />
//                                     <InputBox title="Port of Loading" isMandatory inputFor="portOfLoading" value={form.portOfLoading} handleChangeFunction={setField("portOfLoading")} placeholder="e.g. JNPT Mumbai" />
//                                     <InputBox title="Port of Final Destination" isMandatory inputFor="portOfFinalDestination" value={form.portOfFinalDestination} handleChangeFunction={setField("portOfFinalDestination")} placeholder="e.g. New York" />
//                                     <InputBox title="Airlines / Vessel No." isMandatory inputFor="airlineNo" value={form.operatingAirlines} handleChangeFunction={setField("operatingAirlines")} placeholder="Enter Airline / Vessel No." />
//                                     <CustomSelect
//                                         label="Currency"
//                                         options={[{ id: "USD", name: "USD" }, { id: "INR", name: "INR" }, { id: "EUR", name: "EUR" }]}
//                                         value={form.currency}
//                                         onChange={setField("currency")}
//                                     />
//                                     <InputBox title="Description of Goods" inputFor="description" value={form.description} handleChangeFunction={setField("description")} placeholder="Enter description" />
//                                     <InputBox title="Carton Weight" value="25" isInputBoxDisabled />
//                                     <InputBox title="Marks and Container No." value={totalKgs > 0 ? `001 to ${totalKgs / 25} CARTONS` : "—"} isInputBoxDisabled />
//                                     <InputBox title="No. of Packing Details" value={totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"} isInputBoxDisabled />
//                                     <InputBox title="Shipping Marks" value="DCS" isInputBoxDisabled />
//                                 </Grid3>
//                             </Section>

//                             {/* S5: Products */}
//                             <Section icon={Package} title="Product Details" subtitle="Products attached to this invoice">
//                                 <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
//                                     {["Product", "Size", "Qty (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
//                                         <p key={i} className={labelCls}>{h}</p>
//                                     ))}
//                                 </div>

//                                 {contractItems.length === 0 ? (
//                                     <p className="text-sm text-slate-300 italic py-6 text-center">No products on this invoice</p>
//                                 ) : (
//                                     <div className="space-y-3">
//                                         {contractItems.map((item, i) => {
//                                             const prod = item.product;
//                                             const qty = parseFloat(item.weight) || 0;
//                                             const rate = parseFloat(item.pricePerKg ?? prod?.pricePerKg) || 0;
//                                             const total = qty * rate;
//                                             return (
//                                                 <motion.div
//                                                     key={item.id ?? i}
//                                                     initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
//                                                     className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-start"
//                                                 >
//                                                     <div className={`${roCls} flex-col !items-start text-slate-800`}>
//                                                         <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
//                                                     </div>
//                                                     <div className={`${roCls} justify-end text-slate-800`}>{prod?.size ?? "—"}</div>
//                                                     <div className={`${roCls} justify-end ${qty === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>{qty === 0 ? "—" : qty.toLocaleString()}</div>
//                                                     <div className={`${roCls} justify-end ${rate === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>{rate === 0 ? "—" : rate.toFixed(2)}</div>
//                                                     <div className={`${roCls} justify-end font-bold ${total === 0 ? "text-slate-300 italic" : "text-slate-700"}`}>{total === 0 ? "—" : total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
//                                                 </motion.div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}

//                                 <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                                     <div className="flex gap-5 text-sm">
//                                         <span className="text-slate-500">Total KGS: <span className="font-black text-slate-800">{totalKgs.toLocaleString()}</span></span>
//                                         <span className="text-slate-500">Rows: <span className="font-black text-slate-800">{contractItems.length}</span></span>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className={labelCls}>Invoice Value</p>
//                                         <p className="text-2xl font-black text-[#003366]">
//                                             {form.currency || "US$"}{" "}
//                                             {(invoiceData.totalAmount ?? totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </Section>

//                         </motion.div>
//                     )}
//                 </div>
//             </main>

//             {/* ── Add Party Modal ── */}
//             <AnimatePresence>
//                 {modalSection && (
//                     <AddPartyModal
//                         initialType={modalSection}
//                         customerId={invoiceData?.customerId}
//                         onClose={() => setModalSection(null)}
//                         onSuccess={handlePartyAdded}
//                     />
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }


import { useState, useEffect, useCallback } from "react";
import {
    FileText, Package, Truck,
    Loader2, MapPin, Phone, Mail,
    Info, UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import CustomSelect from "../components/CustomSelect";
import InputBox from "../components/InputBox";

import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";
import toast from "react-hot-toast";
import { useLazyGetalltermofpaymentQuery } from "./payment_productApi/payment_productApiSlice";
import PartySection from "../components/AddPartyModal";

// ── Style tokens ──────────────────────────────────────────────────────────────
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";
const roCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[45px] flex items-center";

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

export default function InvoiceDetails({
    selectedInvoiceId,
    originalData,
    invoiceFetching,
    refetch,
    dirtyData,
    markDirty,
    setDirtyData,
    form,
    setform,
}) {
    // ── RTK Query hooks ───────────────────────────────────────────────────────
    const [getalltermofpayment, { isLoading: loadingTerms }] = useLazyGetalltermofpaymentQuery();
    const [getCustomerbyId, { isLoading: loadingCustomer }] = useGetCustomerbyIdMutation();
    const [addCustomerParty] = useAddCustomerPartyMutation();
    const invoiceData = form;
    const [customerparty, setCustomerparty] = useState(null);
    const [termpay, setTermpay] = useState([]);

    useEffect(() => {
        if (!invoiceData) return;
        const fetchTerms = async () => {
            try {
                const resp = await getalltermofpayment().unwrap();
                if (resp?.success) {
                    setTermpay(resp?.data);
                }
            } catch (err) {
                console.error(err);
                toast.error(err.data?.message || 'fail to fetch term of payment')
            }
        };
        fetchTerms();
    }, [invoiceData]);

    // ── Fetch customer parties ────────────────────────────────────────────────
    const fetchCustomerParties = useCallback(async (customerId) => {
        if (!customerId) return;
        try {
            const res = await getCustomerbyId(customerId).unwrap();
            if (res?.success) {
                setCustomerparty(res.data);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.data?.message || "fail to fetch customerbyID")
        }
    }, [getCustomerbyId]);

    useEffect(() => {
        const customerId = invoiceData?.customerId;
        if (!customerId) return;
        fetchCustomerParties(customerId);
    }, [invoiceData?.customerId, fetchCustomerParties]);

    const setField = useCallback((key) => (valOrEvent) => {
        const value = valOrEvent?.target ? valOrEvent.target.value : valOrEvent;
        setform((prev) => ({ ...prev, [key]: value }));
        markDirty(key, value);
    }, [markDirty]);

    // ── Derived values ────────────────────────────────────────────────────────
    const contractItems = invoiceData?.items ?? [];
    const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalAmount = contractItems.reduce((s, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + qty * rate;
    }, 0);

    // ── Party creation (used by PartySection → PartyFormModal) ────────────────
    const handleCreatePartyApi = async (type, formValues) => {
        const customerId = invoiceData?.customerId;
        const res = await addCustomerParty({
            type,
            customerId,
            data: formValues,
        }).unwrap();

        await fetchCustomerParties(customerId);

        return res.data;
    };

    const hasInvoice = !!invoiceData && !!selectedInvoiceId;

    if (!selectedInvoiceId) {
        return (
            <div className="h-[calc(100vh-15vh)] bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400">Select an invoice to view details</p>
                    <p className="text-xs text-slate-300">Use the dropdown above to choose an invoice</p>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="h-[calc(100vh-15vh)] bg-slate-50 flex flex-col overflow-hidden">

            {/* ── Scrollable Content ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto px-4 py-6 space-y-5">

                    {/* Loading */}
                    {invoiceFetching && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
                                <p className="text-sm text-slate-400">Loading invoice details…</p>
                            </div>
                        </div>
                    )}

                    {!invoiceFetching && hasInvoice && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                            {/* S1: Basic Information */}
                            <Section icon={Info} title="Basic Information" subtitle="Core invoice identifiers">
                                <Grid3>
                                    <InputBox
                                        title="ProformaInvoice Number" isMandatory inputFor="proformaInvoice"
                                        value={form.proformaInvoiceNo} handleChangeFunction={setField("proformaInvoice")}
                                        placeholder="-" isInputBoxDisabled
                                    />
                                    <InputBox
                                        title="Invoice Number" isMandatory inputFor="invoiceNo"
                                        value={form.invoiceNo} handleChangeFunction={setField("invoiceNo")}
                                        placeholder="12/05/DCS/2026" isInputBoxDisabled
                                    />
                                    <InputBox
                                        title="Invoice Date" isMandatory inputFor="invoiceDate" type="date"
                                        value={form.invoiceDate} handleChangeFunction={setField("invoiceDate")}
                                        isInputBoxDisabled
                                    />
                                </Grid3>
                            </Section>

                            {/* S2: Parties (reusable PartySection) */}
                            <Section icon={UserCheck} title="Parties" subtitle="Buyer is fixed; update Consignee, Notify Party & Contact Person as needed">
                                <PartySection
                                    customer={originalData?.customer}
                                    parties={customerparty ?? {}}
                                    values={form}
                                    disabled={false}
                                    onChange={(field, value) => {
                                        setform((prev) => ({ ...prev, [field]: value }));
                                        markDirty(field, value);
                                    }}
                                    onCreateParty={handleCreatePartyApi}
                                    onPartyCreated={() => {}}
                                />
                            </Section>

                            {/* S3: Invoice Information */}
                            <Section icon={FileText} title="Invoice Information" subtitle="Payment terms and reference details">
                                <Grid3>
                                    <CustomSelect
                                        label="Terms of Payment"
                                        placeholder={loadingTerms ? "Loading…" : "Choose Terms of Payment"}
                                        options={(termpay ?? []).map((e) => ({ id: e.id, name: e.name }))}
                                        value={form.termsOfPaymentId}
                                        onChange={setField("termsOfPaymentId")}
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
                                        value={form.invoicepaymentterm}
                                        onChange={setField("invoicepaymentterm")}
                                    />
                                    <InputBox title="LC Number" inputFor="lcnumber" value={form.lcnumber} handleChangeFunction={setField("lcnumber")} placeholder="Enter LC / No." />
                                    <InputBox title="LC Date" inputFor="lcDate" type="date" value={form.lcDate} handleChangeFunction={setField("lcDate")} />
                                    <InputBox title="Other Reference(s)" inputFor="otherRef" value={form.otherRefrence} handleChangeFunction={setField("otherRefrence")} placeholder="Enter reference" />
                                </Grid3>
                            </Section>

                            {/* S4: Shipping & Delivery */}
                            <Section icon={Truck} title="Shipping & Delivery" subtitle="Origin, routing, and transport details">
                                <Grid3>
                                    <InputBox title="Country of Origin" isMandatory inputFor="countryOfOrigin" value={form.countryOfOrigin} handleChangeFunction={setField("countryOfOrigin")} placeholder="e.g. India" />
                                    <InputBox title="Country of Destination" isMandatory inputFor="countryOfDestination" value={form.countryOfDestination} handleChangeFunction={setField("countryOfDestination")} placeholder="e.g. USA" />
                                    <CustomSelect
                                        label="Pre-Carriage By"
                                        options={[{ id: "Sea", name: "Sea" }, { id: "Air", name: "Air" }, { id: "Road", name: "Road" }]}
                                        value={form.preCarriageBy}
                                        onChange={setField("preCarriageBy")}
                                    />
                                    <InputBox title="Port of Loading" isMandatory inputFor="portOfLoading" value={form.portOfLoading} handleChangeFunction={setField("portOfLoading")} placeholder="e.g. JNPT Mumbai" />
                                    <InputBox title="Port of Final Destination" isMandatory inputFor="portOfFinalDestination" value={form.portOfFinalDestination} handleChangeFunction={setField("portOfFinalDestination")} placeholder="e.g. New York" />
                                    <InputBox title="Airlines / Vessel No." isMandatory inputFor="airlineNo" value={form.operatingAirlines} handleChangeFunction={setField("operatingAirlines")} placeholder="Enter Airline / Vessel No." />
                                    <CustomSelect
                                        label="Currency"
                                        options={[{ id: "USD", name: "USD" }, { id: "INR", name: "INR" }, { id: "EUR", name: "EUR" }]}
                                        value={form.currency}
                                        onChange={setField("currency")}
                                    />
                                    <InputBox title="Description of Goods" inputFor="description" value={form.description} handleChangeFunction={setField("description")} placeholder="Enter description" />
                                    <InputBox title="Carton Weight" value="25" isInputBoxDisabled />
                                    <InputBox title="Marks and Container No." value={totalKgs > 0 ? `001 to ${totalKgs / 25} CARTONS` : "—"} isInputBoxDisabled />
                                    <InputBox title="No. of Packing Details" value={totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"} isInputBoxDisabled />
                                    <InputBox title="Shipping Marks" value="DCS" isInputBoxDisabled />
                                </Grid3>
                            </Section>

                            {/* S5: Products */}
                            <Section icon={Package} title="Product Details" subtitle="Products attached to this invoice">
                                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
                                    {["Product", "Size", "Qty (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
                                        <p key={i} className={labelCls}>{h}</p>
                                    ))}
                                </div>

                                {contractItems.length === 0 ? (
                                    <p className="text-sm text-slate-300 italic py-6 text-center">No products on this invoice</p>
                                ) : (
                                    <div className="space-y-3">
                                        {contractItems.map((item, i) => {
                                            const prod = item.product;
                                            const qty = parseFloat(item.weight) || 0;
                                            const rate = parseFloat(item.pricePerKg ?? prod?.pricePerKg) || 0;
                                            const total = qty * rate;
                                            return (
                                                <motion.div
                                                    key={item.id ?? i}
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                    className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-start"
                                                >
                                                    <div className={`${roCls} flex-col !items-start text-slate-800`}>
                                                        <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
                                                    </div>
                                                    <div className={`${roCls} justify-end text-slate-800`}>{prod?.size ?? "—"}</div>
                                                    <div className={`${roCls} justify-end ${qty === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>{qty === 0 ? "—" : qty.toLocaleString()}</div>
                                                    <div className={`${roCls} justify-end ${rate === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>{rate === 0 ? "—" : rate.toFixed(2)}</div>
                                                    <div className={`${roCls} justify-end font-bold ${total === 0 ? "text-slate-300 italic" : "text-slate-700"}`}>{total === 0 ? "—" : total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex gap-5 text-sm">
                                        <span className="text-slate-500">Total KGS: <span className="font-black text-slate-800">{totalKgs.toLocaleString()}</span></span>
                                        <span className="text-slate-500">Rows: <span className="font-black text-slate-800">{contractItems.length}</span></span>
                                    </div>
                                    <div className="text-right">
                                        <p className={labelCls}>Invoice Value</p>
                                        <p className="text-2xl font-black text-[#003366]">
                                            {form.currency || "US$"}{" "}
                                            {(invoiceData.totalAmount ?? totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </Section>

                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}