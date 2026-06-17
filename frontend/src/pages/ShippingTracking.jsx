


// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Ship, Package, Truck, CheckCircle2, AlertCircle,
//   Loader2, Save, FileText, Building2, User, Phone,
//   Anchor, Container, Plane, Train, MapPin, Hash,
//   Calendar, X,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import InputBox from "../components/InputBox";
// import CustomSelect from "../components/CustomSelect";
// import CustomCheckBox from "../components/CustomCheckBox";
// import {
//   useCreateShippingTrackingMutation,
//   useGetInvoiceByIdQuery,
//   useGetInvoicesQuery,
// } from "./shippingDetailsAPI/ShippingDetailsApislice";



// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Converts any ISO/date string to "YYYY-MM-DDTHH:mm" for datetime-local inputs */
// const toDatetimeLocal = (val) => {
//   if (!val) return "";
//   try {
//     return new Date(val).toISOString().slice(0, 16);
//   } catch {
//     return "";
//   }
// };

// // ─── Empty form factory ───────────────────────────────────────────────────────
// const makeEmptyForm = () => ({
//   invoiceId: "",
//   invoiceNo: "",
//   invoiceDate: "",
//   netWeight: "",
//   grossWeight: "",
//   totalAmount: "",
//   partyId: "",
//   buyerName: "",
//   buyerCountry: "",
//   noOfCartons: "",
//   smark: "",
//   blAwbNo: "",
//   shippingBillNo: "",
//   shippingBillDate: "",
//   factoryCode: "",
//   lorryNos: "",
//   driversName: "",
//   mobileNo: "",
//   shipmentTakenBy: "",
//   port: "",
//   shipmentHandedOverTo: "",
//   containerNo: "",
//   containerSealNo: "",
//   flightNo: "",
//   trainNo: "",
//   // checkboxes + timestamps
//   stockOutFromPKS: false,
//   stockOutFromPKSDate: "",
//   lorryInCustomWarehouse: false,
//   lorryInCustomWarehouseDate: "",
//   lorryOutFromCustomWarehouse: false,
//   lorryOutFromCustomWarehouseDate: "",
//   passedShipmentFromCustomOnDate: false,
//   passedShipmentFromCustomOnDateVal: "",
//   containerStuffingDate: false,
//   containerStuffingDateVal: "",
//   railOutDate: false,
//   railOutDateVal: "",
// });

// // ─── Section Header ───────────────────────────────────────────────────────────
// function SectionHeader({ icon: Icon, title, subtitle }) {
//   return (
//     <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
//       <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center flex-shrink-0">
//         <Icon size={15} className="text-blue-200" />
//       </div>
//       <div>
//         <p className="text-[13px] font-bold text-slate-800 tracking-wide">{title}</p>
//         {subtitle && (
//           <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Field Row ────────────────────────────────────────────────────────────────
// function FieldRow({ children, cols = 2 }) {
//   return (
//     <div
//       className={`grid gap-4 mb-4 ${cols === 1
//         ? "grid-cols-1"
//         : cols === 3
//           ? "grid-cols-1 md:grid-cols-3"
//           : "grid-cols-1 md:grid-cols-2"
//         }`}
//     >
//       {children}
//     </div>
//   );
// }

// // ─── Checkbox Row ─────────────────────────────────────────────────────────────
// function CheckboxRow({ label, checked, onChange, dateValue, onDateChange }) {
//   return (
//     <div className="flex flex-wrap items-center gap-3 py-2.5">
//       <div className="flex-1 min-w-0">
//         <CustomCheckBox
//           label={label}
//           checked={checked}
//           onChange={onChange}
//           name={label}
//         />
//       </div>
//       {checked && onDateChange && (
//         <input
//           type="datetime-local"
//           value={dateValue || ""}
//           onChange={(e) => onDateChange(e.target.value)}
//           className="text-[11px] border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366] text-gray-600 bg-white transition-all"
//         />
//       )}
//     </div>
//   );
// }

// // ─── Info Banner ─────────────────────────────────────────────────────────────
// function InfoBanner({ form }) {
//   const items = [
//     { label: "Invoice", value: form.invoiceNo },
//     { label: "Date", value: form.invoiceDate },
//     { label: "Buyer", value: form.buyerName },
//     { label: "Country", value: form.buyerCountry },
//     { label: "Cartons", value: form.noOfCartons },
//     { label: "Amount", value: form.totalAmount ? `USD ${form.totalAmount}` : "" },
//   ];
//   return (
//     <div className="bg-[#003366] rounded-2xl px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
//       {items.map((item, i) => (
//         <React.Fragment key={item.label}>
//           {i > 0 && (
//             <div className="h-7 w-px bg-blue-700/60 hidden sm:block" />
//           )}
//           <div className="min-w-0">
//             <p className="text-[9px] text-blue-300 font-semibold uppercase tracking-widest leading-none mb-0.5">
//               {item.label}
//             </p>
//             <p className="text-[13px] font-semibold truncate max-w-[140px]">
//               {item.value || "—"}
//             </p>
//           </div>
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// // ─── Validation ───────────────────────────────────────────────────────────────
// function validateForm(form) {
//   if (!form.invoiceNo) {
//     toast.error("Invoice No. is required");
//     return false;
//   }
//   if (form.mobileNo && !/^\d{10}$/.test(form.mobileNo)) {
//     toast.error("Mobile number must be exactly 10 digits");
//     return false;
//   }
//   if (form.stockOutFromPKS && !form.stockOutFromPKSDate) {
//     toast.error("Please select Stock Out date & time");
//     return false;
//   }
//   if (form.lorryInCustomWarehouse && !form.lorryInCustomWarehouseDate) {
//     toast.error("Please select Lorry In Custom Warehouse date & time");
//     return false;
//   }
//   if (form.lorryOutFromCustomWarehouse && !form.lorryOutFromCustomWarehouseDate) {
//     toast.error("Please select Lorry Out from Custom Warehouse date & time");
//     return false;
//   }
//   if (form.passedShipmentFromCustomOnDate && !form.passedShipmentFromCustomOnDateVal) {
//     toast.error("Please select Passed Shipment from Custom date");
//     return false;
//   }
//   if (form.containerStuffingDate && !form.containerStuffingDateVal) {
//     toast.error("Please select Container Stuffing date");
//     return false;
//   }
//   if (form.railOutDate && !form.railOutDateVal) {
//     toast.error("Please select Rail Out date");
//     return false;
//   }
//   return true;
// }

// // ─── Main Form ────────────────────────────────────────────────────────────────
// export default function ShipmentTrackingForm({ selectedInvoiceId, setSelectedInvoiceId, originalData, invoiceFetching, refetch, dirtyData, markDirty, setDirtyData, }) {
//   // const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
//   const [form, setForm] = useState(makeEmptyForm());

//   // ── RTK Query ──
//   const {
//     data: invoicesRes,
//     isLoading: invoicesLoading,
//     isError: invoicesError,
//   } = useGetInvoicesQuery();
//   const invoicesData = invoicesRes?.data ?? [];

//   const {
//     data: invoiceRes,
//     isLoading: invoiceDetailLoading,
//     isFetching: invoiceDetailFetching,
//   } = useGetInvoiceByIdQuery(selectedInvoiceId, {
//     skip: !selectedInvoiceId,
//   });
//   const invoiceDetail = originalData

//   const [
//     createShippingTracking,
//     {
//       isLoading: isSubmitting,
//       isSuccess,
//       isError: submitError,
//       reset: resetMutation,
//     },
//   ] = useCreateShippingTrackingMutation();

//   // ── Invoice change: reset form immediately ──
//   const handleInvoiceChange = useCallback(
//     (id) => {
//       setSelectedInvoiceId(id);
//       setForm(makeEmptyForm());
//       resetMutation?.();
//     },
//     [resetMutation]
//   );

//   // ── Auto-fill when invoice detail loads ──
//   useEffect(() => {
//     if (!invoiceDetail) return;
//     setForm((prev) => ({
//       ...prev,
//       invoiceId: invoiceDetail.id ?? "",
//       invoiceNo: invoiceDetail.invoiceNo ?? "",
//       invoiceDate: invoiceDetail.invoiceDate ?? "",
//       netWeight: invoiceDetail.packing != null ? invoiceDetail.packing * 25 : "",
//       grossWeight: invoiceDetail.grossWeight ?? "",
//       totalAmount: invoiceDetail.totalAmount ?? "",
//       partyId: invoiceDetail.customerId ?? "",
//       buyerName: invoiceDetail.customer?.name ?? "",
//       buyerCountry: invoiceDetail.customer?.country ?? "",
//       noOfCartons: invoiceDetail.packing ?? "",
//       smark: invoiceDetail.smark ?? "",
//       blAwbNo: invoiceDetail.awbNo ?? "",
//       shippingBillNo: invoiceDetail.shippingBillNo ?? "",
//       shippingBillDate: invoiceDetail.shippingDate ?? "",
//       port: invoiceDetail.portOfLoading ?? "",
//       flightNo: invoiceDetail.operatingAirlines ?? "",
//       // pre-fillable tracking fields
//       factoryCode: invoiceDetail.factoryCode ?? "",
//       lorryNos: invoiceDetail.lorryNo ?? "",
//       driversName: invoiceDetail.driverName ?? "",
//       mobileNo: invoiceDetail.driverPhone ?? "",
//       shipmentTakenBy: invoiceDetail.shipmentTakenBy ?? "",
//       shipmentHandedOverTo: invoiceDetail.shipmentHandedOverTo ?? "",
//       containerNo: invoiceDetail.containerNo ?? "",
//       containerSealNo: invoiceDetail.containerSealNo ?? "",
//       trainNo: invoiceDetail.trainNo ?? "",
//       // checkboxes + timestamps
//       stockOutFromPKS: invoiceDetail.stockOutFromPKSGodown ?? false,
//       stockOutFromPKSDate: toDatetimeLocal(invoiceDetail.stockOutDateTime),
//       lorryInCustomWarehouse: invoiceDetail.lorryInCustomWarehouse ?? false,
//       lorryInCustomWarehouseDate: toDatetimeLocal(invoiceDetail.lorryInCustomWarehouseDateTime),
//       lorryOutFromCustomWarehouse: invoiceDetail.lorryOutFromCustomWarehouse ?? false,
//       lorryOutFromCustomWarehouseDate: toDatetimeLocal(invoiceDetail.lorryOutFromCustomWarehouseDateTime),
//       passedShipmentFromCustomOnDate: invoiceDetail.passedShipmentFromCustom ?? false,
//       passedShipmentFromCustomOnDateVal: toDatetimeLocal(invoiceDetail.passedShipmentFromCustomDate),
//       containerStuffingDate: invoiceDetail.containerStuffing ?? false,
//       containerStuffingDateVal: toDatetimeLocal(invoiceDetail.containerStuffingDate),
//       railOutDate: invoiceDetail.railOut ?? false,
//       railOutDateVal: toDatetimeLocal(invoiceDetail.railOutDateTime),
//     }));
//   }, [invoiceDetail]);

//   // ── Toast on RTK success / error ──
//   // useEffect(() => {
//   //   if (isSuccess) toast.success("Shipment tracking saved successfully!");
//   // }, [isSuccess]);

//   useEffect(() => {
//     if (submitError) toast.error("Failed to save. Please try again.");
//   }, [submitError]);

//   // ── Field helpers ──
//   const handleField = useCallback(
//     (field) => (e) => {
//       const val = e?.target?.value !== undefined ? e.target.value : e;
//       setForm((prev) => ({ ...prev, [field]: val }));
//     },
//     []
//   );

//   const handleCheckbox = useCallback(
//     (field, dateField) => (checked) => {
//       setForm((prev) => ({
//         ...prev,
//         [field]: checked,
//         ...(dateField && !checked ? { [dateField]: "" } : {}),
//       }));
//     },
//     []
//   );

//   // ── Submit ──
//   const handleSubmit = async () => {
//     if (!validateForm(form)) return;

//     const payload = {
//       invoiceId: form.invoiceId,
//       shipmentDetails: {
//         invoiceNo: form.invoiceNo,
//         invoiceDate: form.invoiceDate,
//         netWeight: form.netWeight,
//         grossWeight: form.grossWeight,
//         totalAmount: form.totalAmount,
//         partyId: form.partyId,
//         buyerName: form.buyerName,
//         buyerCountry: form.buyerCountry,
//         noOfCartons: form.noOfCartons,
//         smark: form.smark,
//         blAwbNo: form.blAwbNo,
//         shippingBillNo: form.shippingBillNo,
//         shippingBillDate: form.shippingBillDate,
//       },
//       trackingActivities: {
//         stockOutFromPKS: form.stockOutFromPKS,
//         stockOutFromPKSDate: form.stockOutFromPKSDate,
//         factoryCode: form.factoryCode,
//         lorryNos: form.lorryNos,
//         driversName: form.driversName,
//         mobileNo: form.mobileNo,
//         shipmentTakenBy: form.shipmentTakenBy,
//         port: form.port,
//         shipmentHandedOverTo: form.shipmentHandedOverTo,
//         lorryInCustomWarehouse: form.lorryInCustomWarehouse,
//         lorryInCustomWarehouseDate: form.lorryInCustomWarehouseDate,
//         lorryOutFromCustomWarehouse: form.lorryOutFromCustomWarehouse,
//         lorryOutFromCustomWarehouseDate: form.lorryOutFromCustomWarehouseDate,
//       },
//       customActivities: {
//         passedShipmentFromCustomOnDate: form.passedShipmentFromCustomOnDate,
//         passedShipmentFromCustomOnDateVal: form.passedShipmentFromCustomOnDateVal,
//         containerNo: form.containerNo,
//         containerStuffingDate: form.containerStuffingDate,
//         containerStuffingDateVal: form.containerStuffingDateVal,
//         containerSealNo: form.containerSealNo,
//         flightNo: form.flightNo,
//         trainNo: form.trainNo,
//         railOutDate: form.railOutDate,
//         railOutDateVal: form.railOutDateVal,
//       },
//     };

//     try {
//       const res = await createShippingTracking(payload).unwrap();
//       toast.success(res?.message)
//       await handleCancel();
//     } catch (err) {
//       const msg = err?.data?.message ?? "Something went wrong. Please try again.";
//       toast.error(msg);
//     }
//   };

//   // ── Cancel ──
//   const handleCancel = () => {
//     setForm(makeEmptyForm());
//     setSelectedInvoiceId(null);
//     resetMutation?.();
//   };

//   const invoiceOptions = invoicesData.map((inv) => ({
//     id: inv.id,
//     name: inv.invoiceNo,
//   }));

//   const isDetailLoading = invoiceDetailLoading || invoiceDetailFetching;

//   // ── Invoice selector (shared between desktop + mobile) ──
//   const InvoiceSelector = () => {
//     if (invoicesLoading) {
//       return (
//         <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50">
//           <Loader2 size={12} className="animate-spin" />
//           Loading invoices…
//         </div>
//       );
//     }
//     if (invoicesError) {
//       return (
//         <div className="flex items-center gap-2 text-xs text-red-400 px-3 py-2 rounded-xl border border-red-100 bg-red-50">
//           <AlertCircle size={12} />
//           Failed to load invoices
//         </div>
//       );
//     }
//     return (
//       <CustomSelect
//         options={invoiceOptions}
//         value={selectedInvoiceId}
//         onChange={handleInvoiceChange}
//         placeholder="Select invoice…"
//         label=""
//         searchable
//       />
//     );
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h bg-slate-50 font-sans">

//       {/* ── Sticky Header ── */}
//       <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
//         <div className="mx-auto px-4 sm:px-6">
//           <div className="flex items-center justify-between h-14 gap-3">

//             {/* Brand */}
//             <div className="flex items-center gap-2.5 flex-shrink-0">
//               <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
//                 <Ship size={16} className="text-blue-100" />
//               </div>
//               <div className="hidden sm:block">
//                 <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-none">
//                   Shipment Tracking
//                 </p>
//                 <p className="text-[10px] text-slate-400 mt-0.5">
//                   DCS International Trading Co.
//                 </p>
//               </div>
//             </div>



//             {/* Actions */}
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <div className="w-72 hidden sm:block">
//                 <InvoiceSelector />
//               </div>

//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all"
//               >
//                 <X size={13} />
//                 <span className="hidden sm:inline">Cancel</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting || !selectedInvoiceId}
//                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003366] text-white text-[12px] font-bold hover:bg-[#004080] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//               >
//                 {isSubmitting ? (
//                   <Loader2 size={13} className="animate-spin" />
//                 ) : (
//                   <Save size={13} />
//                 )}
//                 {isSubmitting ? "Saving…" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ── Mobile Invoice Selector ── */}
//       <div className="sm:hidden bg-white border-b border-slate-100 px-4 py-3">
//         <InvoiceSelector />
//       </div>

//       {/* ── Empty State ── */}
//       {!selectedInvoiceId && (
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
//           <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <FileText size={28} className="text-slate-400" />
//           </div>
//           <p className="text-slate-600 font-semibold text-sm">
//             Select an invoice to begin tracking
//           </p>
//           <p className="text-slate-400 text-xs mt-1">
//             Choose a  Invoice from the dropdown above
//           </p>
//         </div>
//       )}

//       {/* ── Loading State ── */}
//       {selectedInvoiceId && isDetailLoading && (
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
//           <Loader2
//             size={28}
//             className="animate-spin text-[#003366] mx-auto mb-3"
//           />
//           <p className="text-slate-500 text-sm font-medium">
//             Fetching invoice details…
//           </p>
//         </div>
//       )}

//       {/* ── Form Body ── */}
//       {selectedInvoiceId && !isDetailLoading && (
//         <main className="mx-auto px-4 sm:px-6 py-6 space-y-5">

//           {/* Info Banner */}
//           <InfoBanner form={form} />

//           {/* ── Section 1: Invoice Details ── */}
//           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
//             <SectionHeader
//               icon={FileText}
//               title="Invoice Details"
//               subtitle="Auto-filled from selected invoice"
//             />
//             <FieldRow cols={3}>
//               <InputBox
//                 title="Invoice No."
//                 value={form.invoiceNo}
//                 handleChangeFunction={handleField("invoiceNo")}
//                 inputFor="invoiceNo"
//                 placeholder="e.g. 15/DCS/29/27"
//                 isInputBoxDisabled
//                 icon={<Hash size={13} />}
//               />
//               <InputBox
//                 title="Invoice Date"
//                 value={form.invoiceDate}
//                 handleChangeFunction={handleField("invoiceDate")}
//                 inputFor="invoiceDate"
//                 placeholder="DD-MMM-YYYY"
//                 isInputBoxDisabled
//                 icon={<Calendar size={13} />}
//               />
//               <InputBox
//                 title="Party ID"
//                 value={form.partyId}
//                 handleChangeFunction={handleField("partyId")}
//                 inputFor="partyId"
//                 placeholder="Party ID"
//                 isInputBoxDisabled
//               />
//             </FieldRow>
//             <FieldRow cols={3}>
//               <InputBox
//                 title="Net Weight (KG)"
//                 value={form.netWeight}
//                 handleChangeFunction={handleField("netWeight")}
//                 inputFor="netWeight"
//                 placeholder="0.000"
//                 icon={<Package size={13} />}
//                 isInputBoxDisabled
//               />
//               <InputBox
//                 title="Gross Weight (KG)"
//                 value={form.grossWeight}
//                 handleChangeFunction={handleField("grossWeight")}
//                 inputFor="grossWeight"
//                 placeholder="0.000"
//                 isInputBoxDisabled
//               />
//               <InputBox
//                 title="Total Amount"
//                 value={form.totalAmount}
//                 handleChangeFunction={handleField("totalAmount")}
//                 inputFor="totalAmount"
//                 placeholder="0.00"
//                 isSufixOrPrefix="prefix"
//                 measure="USD"
//                 isInputBoxDisabled
//               />
//             </FieldRow>
//             <FieldRow cols={3}>
//               <InputBox
//                 title="No. of Cartons"
//                 value={form.noOfCartons}
//                 handleChangeFunction={handleField("noOfCartons")}
//                 inputFor="noOfCartons"
//                 placeholder="e.g. 19"
//                 icon={<Container size={13} />}
//                 isInputBoxDisabled
//               />
//               <InputBox
//                 title="S. Mark"
//                 value={form.smark}
//                 handleChangeFunction={handleField("smark")}
//                 inputFor="smark"
//                 placeholder="S. Mark"
//                 isInputBoxDisabled
//               />
//               <InputBox
//                 title="B/L or AWB No."
//                 value={form.blAwbNo}
//                 handleChangeFunction={handleField("blAwbNo")}
//                 inputFor="blAwbNo"
//                 placeholder="B/L or AWB No."
//                 isInputBoxDisabled
//               />
//             </FieldRow>
//             <FieldRow>
//               <InputBox
//                 title="Shipping Bill No."
//                 value={form.shippingBillNo}
//                 handleChangeFunction={handleField("shippingBillNo")}
//                 inputFor="shippingBillNo"
//                 placeholder="Shipping Bill Number"
//                 icon={<FileText size={13} />}
//                 isInputBoxDisabled
//               />
//               <InputBox
//                 title="Shipping Bill Date"
//                 value={form.shippingBillDate}
//                 handleChangeFunction={handleField("shippingBillDate")}
//                 inputFor="shippingBillDate"
//                 placeholder="DD-MMM-YYYY"
//                 icon={<Calendar size={13} />}
//                 isInputBoxDisabled
//               />
//             </FieldRow>
//           </div>

//           {/* ── Section 2: Shipment Tracking ── */}
//           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
//             <SectionHeader
//               icon={Truck}
//               title="1 — Shipment Tracking"
//               subtitle="Factory to customs handover"
//             />

//             <div className="mb-4 divide-y divide-slate-50">
//               <CheckboxRow
//                 label="Stock Out from PKS Godown Date & Time"
//                 checked={form.stockOutFromPKS}
//                 onChange={handleCheckbox("stockOutFromPKS", "stockOutFromPKSDate")}
//                 dateValue={form.stockOutFromPKSDate}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, stockOutFromPKSDate: v }))
//                 }
//               />
//             </div>

//             <FieldRow>
//               <InputBox
//                 title="Factory Code"
//                 value={form.factoryCode}
//                 handleChangeFunction={handleField("factoryCode")}
//                 inputFor="factoryCode"
//                 placeholder="Factory Code"
//                 icon={<Building2 size={13} />}
//               />
//               <InputBox
//                 title="Lorry No(s)"
//                 value={form.lorryNos}
//                 handleChangeFunction={handleField("lorryNos")}
//                 inputFor="lorryNos"
//                 placeholder="e.g. HR55AA1234"
//                 icon={<Truck size={13} />}
//               />
//             </FieldRow>
//             <FieldRow>
//               <InputBox
//                 title="Driver(s) Name"
//                 value={form.driversName}
//                 handleChangeFunction={handleField("driversName")}
//                 inputFor="driversName"
//                 placeholder="Driver full name"
//                 icon={<User size={13} />}
//               />
//               <InputBox
//                 title="Mobile No."
//                 type="number"
//                 value={form.mobileNo}
//                 handleChangeFunction={handleField("mobileNo")}
//                 inputFor="mobileNo"
//                 placeholder="10-digit mobile number"
//                 icon={<Phone size={13} />}
//               />
//             </FieldRow>
//             <FieldRow>
//               <InputBox
//                 title="Shipment Taken By"
//                 value={form.shipmentTakenBy}
//                 handleChangeFunction={handleField("shipmentTakenBy")}
//                 inputFor="shipmentTakenBy"
//                 placeholder="Person name"
//                 icon={<User size={13} />}
//               />
//               <InputBox
//                 title="Port"
//                 value={form.port}
//                 handleChangeFunction={handleField("port")}
//                 inputFor="port"
//                 placeholder="e.g. NHAVA SHEVA"
//                 icon={<Anchor size={13} />}
//               />
//             </FieldRow>
//             <FieldRow cols={1}>
//               <InputBox
//                 title="Shipment Handed Over To"
//                 value={form.shipmentHandedOverTo}
//                 handleChangeFunction={handleField("shipmentHandedOverTo")}
//                 inputFor="shipmentHandedOverTo"
//                 placeholder="Forwarding agent / CFS name"
//                 icon={<MapPin size={13} />}
//               />
//             </FieldRow>

//             <div className="mt-1 divide-y divide-slate-50">
//               <CheckboxRow
//                 label="Lorry In Custom Warehouse Date & Time"
//                 checked={form.lorryInCustomWarehouse}
//                 onChange={handleCheckbox(
//                   "lorryInCustomWarehouse",
//                   "lorryInCustomWarehouseDate"
//                 )}
//                 dateValue={form.lorryInCustomWarehouseDate}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, lorryInCustomWarehouseDate: v }))
//                 }
//               />
//               <CheckboxRow
//                 label="Lorry Out from Custom Warehouse Date & Time"
//                 checked={form.lorryOutFromCustomWarehouse}
//                 onChange={handleCheckbox(
//                   "lorryOutFromCustomWarehouse",
//                   "lorryOutFromCustomWarehouseDate"
//                 )}
//                 dateValue={form.lorryOutFromCustomWarehouseDate}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, lorryOutFromCustomWarehouseDate: v }))
//                 }
//               />
//             </div>
//           </div>

//           {/* ── Section 3: Custom Activities ── */}
//           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
//             <SectionHeader
//               icon={Package}
//               title="2 — Custom Activities"
//               subtitle="Post customs clearance details"
//             />

//             <div className="mb-4 divide-y divide-slate-50">
//               <CheckboxRow
//                 label="Passed Shipment from Custom On Date"
//                 checked={form.passedShipmentFromCustomOnDate}
//                 onChange={handleCheckbox(
//                   "passedShipmentFromCustomOnDate",
//                   "passedShipmentFromCustomOnDateVal"
//                 )}
//                 dateValue={form.passedShipmentFromCustomOnDateVal}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, passedShipmentFromCustomOnDateVal: v }))
//                 }
//               />
//             </div>

//             <FieldRow>
//               <InputBox
//                 title="Container No."
//                 value={form.containerNo}
//                 handleChangeFunction={handleField("containerNo")}
//                 inputFor="containerNo"
//                 placeholder="e.g. TEMU1234567"
//                 icon={<Container size={13} />}
//               />
//               <InputBox
//                 title="Container Seal No."
//                 value={form.containerSealNo}
//                 handleChangeFunction={handleField("containerSealNo")}
//                 inputFor="containerSealNo"
//                 placeholder="Seal Number"
//               />
//             </FieldRow>

//             <div className="mb-4 divide-y divide-slate-50">
//               <CheckboxRow
//                 label="Container Stuffing Date"
//                 checked={form.containerStuffingDate}
//                 onChange={handleCheckbox(
//                   "containerStuffingDate",
//                   "containerStuffingDateVal"
//                 )}
//                 dateValue={form.containerStuffingDateVal}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, containerStuffingDateVal: v }))
//                 }
//               />
//             </div>

//             <FieldRow>
//               <InputBox
//                 title="Flight No."
//                 value={form.flightNo}
//                 handleChangeFunction={handleField("flightNo")}
//                 inputFor="flightNo"
//                 placeholder="e.g. SQ 402"
//                 icon={<Plane size={13} />}
//               />
//               <InputBox
//                 title="Train No."
//                 value={form.trainNo}
//                 handleChangeFunction={handleField("trainNo")}
//                 inputFor="trainNo"
//                 placeholder="Train Number"
//                 icon={<Train size={13} />}
//               />
//             </FieldRow>

//             <div className="divide-y divide-slate-50">
//               <CheckboxRow
//                 label="Rail Out Date"
//                 checked={form.railOutDate}
//                 onChange={handleCheckbox("railOutDate", "railOutDateVal")}
//                 dateValue={form.railOutDateVal}
//                 onDateChange={(v) =>
//                   setForm((p) => ({ ...p, railOutDateVal: v }))
//                 }
//               />
//             </div>
//           </div>

//           {/* bottom spacing */}
//           <div className="h-8" />
//         </main>
//       )}
//     </div>
//   );
// }



import { AnimatePresence, motion } from "framer-motion";
import InputBox from "../components/InputBox";
import { useCallback } from "react";
import { Anchor, Building2, Calendar, ChevronRight, Container, FileText, Hash, Landmark, MapPin, Package, Phone, Plane, Train, Truck, User } from "lucide-react";
import CustomCheckBox from "../components/CustomCheckBox";


const MetaPill = ({ label, value }) =>
  value ? (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  ) : null;


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


function CheckboxDateField({
  label,
  checked,
  onChange,
  name,
  dateValue,
  dateField,
  setForm,
  markDirty,
}) {

  const handleDateChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [dateField]: value,
    }));

    markDirty?.(dateField, value);
  };

  return (
    <div className="flex flex-col gap-2">

      <CustomCheckBox
        label={label}
        checked={checked}
        onChange={onChange}
        name={name}
      />

      {checked && (
        <InputBox
          type="date"
          value={dateValue || ""}
          handleChangeFunction={handleDateChange}
          inputFor={dateField}
        />
      )}

    </div>
  );
}

export default function ShipmentTrackingForm({
  selectedInvoiceId,
  originalData,
  invoiceFetching,
  dirtyData,
  markDirty,
  setDirtyData,
  form,
  setform,
}) {



  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
    markDirty(name, value);
  }, [markDirty, setform]);


  const handleCheckbox = (field, dateField) => (checked) => {
    setform((prev) => ({
      ...prev,
      [field]: checked,
      ...(dateField && !checked ? { [dateField]: "" } : {}),
    }));

    markDirty(field, checked);

    if (!checked && dateField) {
      markDirty(dateField, "");
    }
  };

  return (
    <>
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

                <Section title="invoice" icon={Landmark} delay={0.05}>


                  <InputBox
                    title="Invoice No."
                    value={form.invoiceNo}
                    handleChangeFunction={handleChange}
                    inputFor="invoiceNo"
                    placeholder="-"
                    isInputBoxDisabled
                    icon={<Hash size={13} />}
                  />
                  <InputBox
                    title="Invoice Date"
                    value={form.invoiceDate}
                    handleChangeFunction={handleChange}
                    inputFor="invoiceDate"
                    type="date"
                    isInputBoxDisabled
                    icon={<Calendar size={13} />}
                  />
                  <InputBox
                    title="Buyer"
                    value={originalData.customer?.name}
                    handleChangeFunction={handleChange}
                    inputFor="buyer"
                    placeholder="-"
                    isInputBoxDisabled
                  />

                  <InputBox
                    title="Net Weight (KG)"
                    value={form.packing * 25}
                    handleChangeFunction={handleChange}
                    inputFor="netWeight"
                    placeholder="-"
                    icon={<Package size={13} />}
                    isInputBoxDisabled
                  />
                  <InputBox
                    title="Gross Weight (KG)"
                    value={form.grossWeight}
                    handleChangeFunction={handleChange}
                    inputFor="grossWeight"
                    placeholder="-"
                    isInputBoxDisabled
                  />
                  <InputBox
                    title="Total Amount"
                    value={form.totalAmount}
                    handleChangeFunction={handleChange}
                    inputFor="totalAmount"
                    placeholder="-"
                    isSufixOrPrefix="prefix"
                    measure="USD"
                    isInputBoxDisabled
                  />


                  <InputBox
                    title="No. of Cartons"
                    value={form.packing}
                    handleChangeFunction={handleChange}
                    inputFor="noOfCartons"
                    placeholder="-"
                    icon={<Container size={13} />}
                    isInputBoxDisabled
                  />
                  <InputBox
                    title="S. Mark"
                    value={form.smark}
                    handleChangeFunction={handleChange}
                    inputFor="smark"
                    placeholder="-"
                    isInputBoxDisabled
                  />
                  <InputBox
                    title="B/L or AWB No."
                    value={form.awbNo}
                    handleChangeFunction={handleChange}
                    inputFor="blAwbNo"
                    placeholder="-"
                    isInputBoxDisabled
                  />

                  <InputBox
                    title="Shipping Bill No."
                    value={form.shippingBillNo}
                    handleChangeFunction={handleChange}
                    inputFor="shippingBillNo"
                    placeholder="-"
                    icon={<FileText size={13} />}
                    isInputBoxDisabled
                  />
                  <InputBox
                    title="Shipping Bill Date"
                    type="date"
                    value={form.shippingBillDate}
                    handleChangeFunction={handleChange}
                    inputFor="shippingBillDate"
                    icon={<Calendar size={13} />}
                    isInputBoxDisabled
                  />

                </Section>

                <Section title="invoice" icon={Landmark} delay={0.05}>
                  <InputBox
                    title="Factory Code"
                    value={form.factoryCode}
                    handleChangeFunction={handleChange}
                    inputFor="factoryCode"
                    placeholder="-"
                    icon={<Building2 size={13} />}
                  />
                  <InputBox
                    title="Lorry No(s)"
                    value={form.lorryNos}
                    handleChangeFunction={handleChange}
                    inputFor="lorryNos"
                    placeholder="-"
                    icon={<Truck size={13} />}
                  />

                  <InputBox
                    title="Driver(s) Name"
                    value={form.driversName}
                    handleChangeFunction={handleChange}
                    inputFor="driversName"
                    placeholder="-"
                    icon={<User size={13} />}
                  />
                  <InputBox
                    title="Mobile No."
                    type="number"
                    value={form.mobileNo}
                    handleChangeFunction={handleChange}
                    inputFor="mobileNo"
                    placeholder="-"
                    icon={<Phone size={13} />}
                  />

                  <InputBox
                    title="Shipment Taken By"
                    value={form.shipmentTakenBy}
                    handleChangeFunction={handleChange}
                    inputFor="shipmentTakenBy"
                    placeholder="Person name"
                    icon={<User size={13} />}
                  />
                  <InputBox
                    title="Port"
                    value={form.port}
                    handleChangeFunction={handleChange}
                    inputFor="port"
                    placeholder="-"
                    icon={<Anchor size={13} />}
                  />

                  <InputBox
                    title="Shipment Handed Over To"
                    value={form.shipmentHandedOverTo}
                    handleChangeFunction={handleChange}
                    inputFor="shipmentHandedOverTo"
                    placeholder="-"
                    icon={<MapPin size={13} />}
                  />

                  <CheckboxDateField
                    label="Stock Out From PKS"
                    checked={form.stockOutFromPKS}
                    onChange={handleCheckbox("stockOutFromPKS", "stockOutFromPKSDate")}
                    name="stockOutFromPKS"
                    dateValue={form.stockOutFromPKSDate}
                    dateField="stockOutFromPKSDate"
                    setForm={setform}
                    markDirty={markDirty}
                  />


                  <CheckboxDateField
                    label="Lorry IN Custom Warehouse"
                    checked={form.lorryInCustomWarehouse}
                    onChange={handleCheckbox("lorryInCustomWarehouse", "lorryInCustomWarehouseDateTime")}
                    name="lorryInCustomWarehouse"
                    dateValue={form.lorryInCustomWarehouseDateTime}
                    dateField="lorryInCustomWarehouseDateTime"
                    setForm={setform}
                    markDirty={markDirty}
                  />

                  <CheckboxDateField
                    label="Lorry Out Custom Warehouse"
                    checked={form.lorryOutFromCustomWarehouse}
                    onChange={handleCheckbox("lorryOutFromCustomWarehouse", "lorryOutFromCustomWarehouseDateTime")}
                    name="lorryOutFromCustomWarehouse"
                    dateValue={form.lorryOutFromCustomWarehouseDateTime}
                    dateField="lorryOutFromCustomWarehouseDateTime"
                    setForm={setform}
                    markDirty={markDirty}
                  />


                   <CheckboxDateField
                    label="Passed Shipment From Custom"
                    checked={form.passedShipmentFromCustom}
                    onChange={handleCheckbox("passedShipmentFromCustom", "passedShipmentFromCustomDate")}
                    name="passedShipmentFromCustom"
                    dateValue={form.passedShipmentFromCustomDate}
                    dateField="passedShipmentFromCustomDate"
                    setForm={setform}
                    markDirty={markDirty}
                  />

                </Section>

                <Section title="invoice" icon={Landmark} delay={0.05}>
                  <InputBox
                    title="Container No."
                    value={form.containerNo}
                    handleChangeFunction={handleChange}
                    inputFor="containerNo"
                    placeholder="-"
                    icon={<Container size={13} />}
                  />
                  <InputBox
                    title="Container Seal No."
                    value={form.containerSealNo}
                    handleChangeFunction={handleChange}
                    inputFor="containerSealNo"
                    placeholder="-"
                  />

                  <InputBox
                    title="Flight No."
                    value={form.flightNo}
                    handleChangeFunction={handleChange}
                    inputFor="flightNo"
                    placeholder="-"
                    icon={<Plane size={13} />}
                  />
                  <InputBox
                    title="Train No."
                    value={form.trainNo}
                    handleChangeFunction={handleChange}
                    inputFor="trainNo"
                    placeholder="-"
                    icon={<Train size={13} />}
                  />


                  <CheckboxDateField
                    label="Container Stuffing Date"
                    checked={form.containerStuffingDate}
                    onChange={handleCheckbox("containerStuffingDate", "containerStuffingDateVal")}
                    name="containerStuffingDate"
                    dateValue={form.containerStuffingDateVal}
                    dateField="containerStuffingDateVal"
                    setForm={setform}
                    markDirty={markDirty}
                  />


                  <CheckboxDateField
                    label="Rail Out Date"
                    checked={form.railOutDate}
                    onChange={handleCheckbox("railOutDate", "railOutDateVal")}
                    name="railOutDate"
                    dateValue={form.railOutDateVal}
                    dateField="railOutDateVal"
                    setForm={setform}
                    markDirty={markDirty}
                  />

                </Section>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  )
}