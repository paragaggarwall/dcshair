

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
} from "./invoiceapi/Invoiceapislice";
import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";
import { useLazyGetalltermofpaymentQuery } from "./payment_productApi/payment_productApiSlice";
import toast from "react-hot-toast";


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
    sizeScale: "",
    cartonweight: "",
    description: "",
    operatingAirlines: "",
    flightNo: "",
    currency: "",
    shipingMark: "",
    packing: "",
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
            lcDate: data.lcDateFormat,
            otherRef: data.otherRefrence ?? "",
            countryOfOrigin: data.countryOfOrigin ?? "",
            countryOfDestination: data.countryOfDestination ?? "",
            preCarriageBy: data.preCarriageBy ?? "",
            portOfLoading: data.portOfLoading ?? "",
            portOfFinalDestination: data.portOfFinalDestination ?? "",
            description: data.description ?? "",
            operatingAirlines: data.operatingAirlines ?? "",
            flightNo: data.flightNo ?? "",
            consigneeid: data.consignee?.id ?? null,
            notifyPartyid: data.notifyParty?.id ?? null,
            contactPersonid: data.contactPerson?.id ?? null,
            currency: data.currency,
            sizeScale: data.sizeScale,
            cartonweight: data.cartonweight,
            shipingMark: data.shipingMark,
            packing: data.packing ?? "",
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
        setForm((prev) => ({ ...prev, invoiceNo: "" }));

        const fetchParty = async () => {
            try {
                const resp = await getprofomaparty(proformaid).unwrap();
                const data = resp?.data ?? null;
                if (resp?.success) {
                    setD(data);
                    prefillFromData(data);
                    toast.success(resp?.message || 'fetch successfully')
                }
            } catch (e) {
                console.error(e);
                toast.error(e?.data?.message || e?.message || `fail to fetch partydetails`)
                setD(null);
            }
        };
        fetchParty();
    }, [proformaid]);

    // Fetch customer party details when customer changes
    useEffect(() => {
        if (!d?.customerId) return;
        const fetchCustomer = async () => {
            try {
                const res = await getCustomerbyId(d.customerId).unwrap();
                setcustomerparty(res.data);
            } catch (e) { console.error(e); }
        };
        fetchCustomer();
    }, [d?.customerId]);


    // ── Derived values ────────────────────────────────────────────────────────
    const contractItems = d?.items ?? [];
    const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0);
    const totalAmount = contractItems.reduce((s, i) => {
        const weight = parseFloat(i.weight) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + weight * rate;
    }, 0);


    // ── Validation ────────────────────────────────────────────────────────────
    const validateForm = useCallback(() => {
        const {
            invoiceNo, invoiceDate, termsOfPayment, lcnumber, lcDate,
            otherRef, countryOfOrigin, countryOfDestination,
            preCarriageBy, portOfLoading, portOfFinalDestination, operatingAirlines, paymentterm, currency,
        } = form;

        if (!d) { toast.error("Please select a proforma invoice first."); return false; }

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
            { key: "operating Airlines", value: operatingAirlines },
            { key: "Consignee", value: d.consignee },
            { key: "Payment Term", value: paymentterm },
            { key: "Currency", value: currency }
        ];

        for (const field of required) {
            if (isEmptyValue(field.value)) {
                toast.error(`${field.key} is required.`);
                return false;
            }
        }

        return true;
    }, [d, form]);


    // ── Payload builder ───────────────────────────────────────────────────────
    const buildPayload = useCallback(() => {
        const {
            invoiceNo, invoiceDate, termsOfPayment, paymentterm,
            lcnumber, lcDate, otherRef, buyersOrderNo,
            countryOfOrigin, countryOfDestination, preCarriageBy,
            portOfLoading, portOfFinalDestination, description,
            operatingAirlines, flightNo, sizeScale, shipingMark, cartonweight, packing, currency, consigneeid, notifyPartyid, contactPersonid,
        } = form;

        return {
            proformaid,
            invoiceNo,
            invoiceDate,
            lcnumber,
            lcDate,
            otherRef,
            customerId: buyersOrderNo,
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
            packing,
            operatingAirlines: operatingAirlines,
            flightNo,
            shipingMark,
            sizeScale,
            cartonweight,
            invoicepaymentterm: paymentterm ?? null,
            currency: currency ?? null,
            totalAmount: totalAmount,
            items: contractItems.map((item) => ({
                productId: item.productId,
                size: item.size ?? "",
                color: item.color ?? "",
                weight: parseFloat(item.weight) || 0,
                pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
                Amount: item.Amount ?? 0,
            })),
        };
    }, [d, form, proformaid, contractItems, totalKgs, termpay, customerparty]);


    const handleGeneratePdf = async () => {
        if (!validateForm()) return;
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
            toast.error(e?.data?.message ?? e?.message ?? "Failed to generate PDF.");
        }
    };

    // Refresh customer parties after modal save
    const handlePartyAdded = async () => {
        if (!d?.customerId) return;
        try {
            const res = await getCustomerbyId(d.customerId).unwrap();
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
                                            type="date"
                                            isMandatory
                                            inputFor="lcDate"
                                            value={form.lcDate}
                                            handleChangeFunction={setField("lcDate")}
                                        />

                                    </Grid3>
                                </Section>


                                {/* ── S4: Shipping & Delivery ── */}
                                <Section
                                    icon={Truck}
                                    title="Shipping & Delivery"
                                    subtitle="Pre-filled from contract — edit as needed"
                                >

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                                            title="operating Airlines"
                                            isMandatory
                                            inputFor="operatingAirlines"
                                            value={form.operatingAirlines}
                                            handleChangeFunction={setField("operatingAirlines")}
                                            placeholder="-"
                                        />

                                        <InputBox
                                            title="Flight No."
                                            isMandatory
                                            inputFor="flightNo"
                                            value={form.flightNo}
                                            handleChangeFunction={setField("flightNo")}
                                            placeholder="-"
                                        />


                                        <InputBox
                                            title="shiping Mark"
                                            isMandatory
                                            inputFor="shipingMark"
                                            value={form.shipingMark}
                                            handleChangeFunction={setField("shipingMark")}
                                            placeholder="-"
                                        />

                                        <InputBox
                                            title="Packing"
                                            isMandatory
                                            inputFor="packing"
                                            value={form.packing}
                                            handleChangeFunction={setField("packing")}
                                            placeholder="-"
                                        />

                                        <InputBox
                                            title="Description of Goods"
                                            inputFor="description"
                                            value={form.description}
                                            handleChangeFunction={setField("description")}
                                            placeholder="Enter description"
                                        />

                                        <InputBox
                                            title="Other Reference(s)"
                                            isMandatory
                                            inputFor="otherRef"
                                            value={form.otherRef}
                                            handleChangeFunction={setField("otherRef")}
                                            placeholder="Enter reference"
                                        />



                                        <InputBox
                                            title="Marks and Container NO."
                                            value={`001 to ${totalKgs > 0 ? `${totalKgs / form.cartonweight} CARTONS` : "—"}`}
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="NO. of Packing Details"
                                            value={totalKgs > 0 ? `${totalKgs / form.cartonweight} CARTONS` : "—"}
                                            isInputBoxDisabled
                                        />

                                    </div>
                                </Section>


                                {/* ── S5: Products ── */}
                                <Section icon={Package} title="Product Details" subtitle="Products from contract">



                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2 ">
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

                                        <CustomSelect
                                            label="sizeScale"
                                            options={[
                                                { id: "inch", name: "inch" },
                                                { id: "cm", name: "cm" },
                                                { id: "m", name: "m" },
                                            ]}
                                            value={form.sizeScale}
                                            onChange={setField("sizeScale")}
                                        />


                                        <InputBox
                                            title="cartonweight"
                                            isMandatory
                                            inputFor="cartonweight"
                                            value={form.cartonweight}
                                            handleChangeFunction={setField("cartonweight")}
                                            placeholder="-"
                                        />
                                    </div>


                                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
                                        {["Product", "skuCode", "Size", "weight (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
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
                                                const weight = parseFloat(item.weight);
                                                const size = item.size
                                                const rate = parseFloat(item.pricePerKg ?? prod?.pricePerKg);
                                                const total = weight * rate;
                                                return (
                                                    <motion.div
                                                        key={item.id ?? i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-start"
                                                    >
                                                        <div className={`${roCls} flex-col !items-start text-slate-800`}>
                                                            <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
                                                        </div>

                                                        <div className={`${roCls} justify-end text-slate-800`}>
                                                            {prod?.skuCode ?? "—"}
                                                        </div>
                                                        <div className={`${roCls} justify-end text-slate-800`}>
                                                            {size ?? "—"}
                                                        </div>
                                                        <div className={`${roCls} justify-end ${weight === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
                                                            {weight === 0 ? "—" : weight.toLocaleString()}
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
                                                {form.currency} {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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