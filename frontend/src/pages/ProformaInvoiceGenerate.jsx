

import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft, FileText, Package, Truck,
    Loader2, AlertCircle, MapPin, Phone, Mail,
    Download, Info, UserCheck, Plus, X, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import CustomSelect from "../components/CustomSelect";
// import InputBox from "../components/InputBox";
// import {
//     useGetAllContractsQuery,
//     useGetContractByIdMutation,
//     useCreateProformaInvoiceMutation,
//     useLazyGetAllTermsOfPaymentQuery,
// } from "./proformainvoiceapi/ProformaInvoiceApiSlice";
// import { useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";
// import { useAddCustomerPartyMutation } from "../customerapiSlice/apiSlicecustomer";
import InputBox from "../components/inputBox";
import CustomSelect from "../components/CustomSelect";
import { useGetallcontractQuery, useGetproformainvoicepartiesMutation, useProformainvoicecreateMutation } from "./profomainvoice/ProformaApiSlice";
import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from "../customerapiSlice/apiSlicecustomer";
import toast from "react-hot-toast";
import { useLazyGetalltermofpaymentQuery } from "./payment_productApi/payment_productApiSlice";

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

const INITIAL_FORM = {
    proformaInvoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    termsOfPayment: "",
    paymentterm: "",
    lcnumber: "",
    lcDate: "",
    otherRef: "",
    countryOfOrigin: "",
    countryOfDestination: "",
    preCarriageBy: "",
    portOfLoading: "",
    portOfFinalDestination: "",
    description: "",
    operatingAirlines: "",
    flightNo: "",
    currency: "",
    consigneeid: null,
    notifyPartyid: null,
    contactPersonid: null,
};

// ── Sub-components ────────────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
    return (
        <label className={labelCls}>
            {children}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

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
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">{children}</div>;
}

function PartyBlock({ label, options, value, onChange, selectedData, onAdd, loading }) {
    return (
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className={labelCls + " mb-0"}>{label}</span>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1.5 text-[10px] bg-[#003366] font-bold text-white hover:bg-[#004080] px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
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

// ── Add Party Modal ───────────────────────────────────────────────────────────
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
            await addCustomerParty({ type: partyType, customerId, data: { ...partyForm } }).unwrap();
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

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <CustomSelect
                        label="Party Type"
                        placeholder="Select party type"
                        options={PARTY_TYPE_OPTIONS}
                        value={partyType}
                        onChange={setPartyType}
                    />
                    <InputBox title="Name" isMandatory inputFor="partyName" value={partyForm.name} handleChangeFunction={fh("name")} placeholder="Enter party name" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputBox title="Phone" inputFor="partyPhone" value={partyForm.phone} handleChangeFunction={fh("phone")} placeholder="+91 98765 43210" />
                        <InputBox title="Alt. Phone" inputFor="partyAltPhone" value={partyForm.altPhone} handleChangeFunction={fh("altPhone")} placeholder="Optional" />
                    </div>
                    <InputBox title="Email" inputFor="partyEmail" value={partyForm.email} handleChangeFunction={fh("email")} placeholder="email@example.com" />
                    <InputBox title="Address" inputFor="partyAddress" value={partyForm.address} handleChangeFunction={fh("address")} placeholder="Street address" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputBox title="City" inputFor="partyCity" value={partyForm.city} handleChangeFunction={fh("city")} placeholder="City" />
                        <InputBox title="State" inputFor="partyState" value={partyForm.state} handleChangeFunction={fh("state")} placeholder="State" />
                        <InputBox title="Country" inputFor="partyCountry" value={partyForm.country} handleChangeFunction={fh("country")} placeholder="Country" />
                        <InputBox title="Pin / ZIP Code" inputFor="partyPinCode" value={partyForm.pinCode} handleChangeFunction={fh("pinCode")} placeholder="Pin code" />
                    </div>
                    <InputBox title="USCI No." inputFor="partyUsciNo" value={partyForm.usciNo} handleChangeFunction={fh("usciNo")} placeholder="USCI number" />

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
                                : "Add Party"
                        }
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}


// ── Main Component ────────────────────────────────────────────────────────────
export default function ProformaInvoiceGenerate() {
    const navigate = useNavigate();

    // ── RTK Query hooks ───────────────────────────────────────────────────────
    const { data: contractsData, isLoading: loadingContracts } = useGetallcontractQuery();
    const [getContractById, { isLoading: loadingContractData }] = useGetproformainvoicepartiesMutation();
    const [getalltermofpayment, { isLoading: loadingTerms }] = useLazyGetalltermofpaymentQuery();
    const [createProformaInvoice, { isLoading: submitting, isSuccess: submitSuccess }] = useProformainvoicecreateMutation();
    const [getCustomerbyId, { isLoading: loadingCustomer }] = useGetCustomerbyIdMutation();
    const [addCustomerParty] = useAddCustomerPartyMutation();

    // ── State ─────────────────────────────────────────────────────────────────
    const [contracts, setContracts] = useState([]);
    const [contractId, setContractId] = useState("");
    const [d, setD] = useState(null);               // contract detail data
    const [customerparty, setcustomerparty] = useState(null);
    const [termpay, settermpay] = useState([]);
    const [apiError, setApiError] = useState("");
    const [modalSection, setModalSection] = useState(null);

    const [form, setForm] = useState(INITIAL_FORM);

    const setField = useCallback((key) => (valOrEvent) => {
        const value = valOrEvent?.target ? valOrEvent.target.value : valOrEvent;
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    // ── Prefill from contract data ────────────────────────────────────────────
    const prefillFromData = useCallback((data) => {
        if (!data) return;
        setForm((prev) => ({
            ...prev,
            termsOfPayment: data.termsOfPayment?.id ?? "",
            paymentterm: data.paymentterm ?? "",
            lcnumber: data.lcNumber ?? "",
            lcDate: data.lcDate ?? "",
            otherRef: data.otherReference ?? "",
            countryOfOrigin: data.countryOfOrigin ?? "",
            countryOfDestination: data.countryOfDestination ?? "",
            preCarriageBy: data.preCarriageBy ?? "",
            portOfLoading: data.portOfLoading ?? "",
            portOfFinalDestination: data.portOfFinalDestination ?? "",
            description: data.description ?? "",
            operatingAirlines: data.operatingAirlines ?? "",
            flightNo: data.flightNo ?? "",
            currency: data.currency ?? "",
            consigneeid: data.consignee?.id ?? null,
            notifyPartyid: data.notifyParty?.id ?? null,
            contactPersonid: data.contactPerson?.id ?? null,
        }));
    }, []);

    // ── Fetch contracts list ──────────────────────────────────────────────────
    useEffect(() => {
        if (contractsData) setContracts(contractsData?.data ?? contractsData ?? []);
    }, [contractsData]);

    // ── Fetch terms when contract selected ───────────────────────────────────
    useEffect(() => {
        if (!contractId) return;
        const fetchTerms = async () => {
            try {
                const resp = await getalltermofpayment();
                settermpay(resp?.data?.data ?? []);
            } catch (e) { console.error(e); }
        };
        fetchTerms();
    }, [contractId]);

    // ── Fetch contract detail when contractId changes ─────────────────────────
    useEffect(() => {
        if (!contractId) { setD(null); return; }
        setApiError("");
        setForm((prev) => ({ ...prev, proformaInvoiceNo: "" }));

        const fetchContract = async () => {
            try {
                const resp = await getContractById(contractId);
                const data = resp?.data?.data ?? resp?.data ?? null;
                setD(data);
                prefillFromData(data);
            } catch (e) { console.error(e); setD(null); }
        };
        fetchContract();
    }, [contractId]);

    // ── Fetch customer parties when customer changes ──────────────────────────
    useEffect(() => {
        if (!d?.customerId) return;
        const fetchCustomer = async () => {
            try {
                const res = await getCustomerbyId(d.customerId).unwrap();
                if (res?.success) {
                    setcustomerparty(res.data);
                }
            } catch (e) {
                console.error(e.data.message || e);
                toast.error(e || e.data.message || 'fail to fetch customerparty')
            }
        };
        fetchCustomer();
    }, [d?.customerId]);

    // ── Derived values ────────────────────────────────────────────────────────
    const contractItems = d?.contractItems ?? d?.items ?? [];
    const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalAmount = contractItems.reduce((s, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + qty * rate;
    }, 0);

    // ── Validation ────────────────────────────────────────────────────────────
    const validateForm = useCallback(() => {
        const {
            proformaInvoiceNo, invoiceDate, termsOfPayment, paymentterm,
            lcnumber, lcDate, otherRef, countryOfOrigin, countryOfDestination,
            preCarriageBy, portOfLoading, portOfFinalDestination, operatingAirlines, flightNo, currency, consigneeid,
        } = form;

        if (!d) { setApiError("Please select a contract first."); return false; }

        const required = [
            { key: "Proforma Invoice Number", value: proformaInvoiceNo },
            { key: "Invoice Date", value: invoiceDate },
            { key: "Terms of Payment", value: termsOfPayment },
            { key: "Payment Term", value: paymentterm },
            { key: "LC Number", value: lcnumber },
            { key: "LC Date", value: lcDate },
            { key: "Other Reference(s)", value: otherRef },
            { key: "Country of Origin", value: countryOfOrigin },
            { key: "Country of Destination", value: countryOfDestination },
            { key: "Pre-Carriage By", value: preCarriageBy },
            { key: "Port of Loading", value: portOfLoading },
            { key: "Port of Final Destination", value: portOfFinalDestination },
            { key: "Operating Airlines", value: operatingAirlines },
            { Key: "Flight No", value: flightNo },
            { key: "Currency", value: currency },
            { key: "Consignee", value: consigneeid },
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
            proformaInvoiceNo, invoiceDate, termsOfPayment, paymentterm,
            lcnumber, lcDate, otherRef,
            countryOfOrigin, countryOfDestination, preCarriageBy,
            portOfLoading, portOfFinalDestination, description,
            operatingAirlines, flightNo, currency, consigneeid, notifyPartyid, contactPersonid,
        } = form;

        return {
            contractId,
            proformaInvoiceNo,
            proformainvoiceDate: invoiceDate,
            lcnumber,
            lcDate,
            otherRef,
            customerId: d?.customerId ?? "",
            consigneeId: consigneeid ?? "",
            notifyPartyId: notifyPartyid ?? "",
            contactPersonId: contactPersonid ?? "",
            termsOfPaymentId: termsOfPayment ?? "",
            paymentterm,
            countryOfOrigin,
            countryOfFinalDestination: countryOfDestination,
            preCarriageBy,
            portOfLoading,
            portOfFinalDestination,
            description,
            totalKgs,
            packing: String(totalKgs > 0 ? totalKgs / 25 : 0),
            operatingAirlines: operatingAirlines,
            flightNo: flightNo,
            currency,
            totalAmount,
            // customer: d?.customer ?? null,
            // consignee: customerparty?.consignees?.find((c) => c.id === consigneeid) ?? null,
            // notifyParty: customerparty?.notifyParties?.find((n) => n.id === notifyPartyid) ?? null,
            // contactPerson: customerparty?.contactPersons?.find((c) => c.id === contactPersonid) ?? null,
            // termsOfPayment: termpay?.find((c) => c.id === termsOfPayment) ?? null,
            items: contractItems.map((item) => ({
                productId: item.productId,
                name: item.product?.name ?? "",
                // size: item.product?.size ?? "",
                skuCode: item.product?.skuCode ?? "",
                quantity: parseFloat(item.quantity) || 0,
                pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
                // totalAmount: item.totalAmount ?? 0,
            })),
        };
    }, [d, form, contractId, contractItems, totalKgs, totalAmount, termpay, customerparty]);

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validateForm()) return;
        setApiError("");
        try {
            await createProformaInvoice({ body: buildPayload() }).unwrap();
            // On success navigate back after brief delay
            setTimeout(() => navigate("/proformainvoice"), 1200);
        } catch (e) {
            setApiError(e?.data?.error ?? e?.message ?? "Failed to create proforma invoice.");
        }
    };

    const handlePartyAdded = async () => {
        if (!d?.customerId) return;
        try {
            const res = await getCustomerbyId(d.customerId).unwrap();
            if (res?.success) {
                setcustomerparty(res.data);
            }
        } catch (e) {
            console.error(e.data.message || e);
            toast.error(e.data.message || e.message || 'fail to load customerparty')
        }
    };

    const loadingData = loadingContractData || loadingCustomer;
    const canSubmit = !!d && !loadingData && !submitting;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">

            {/* ── HEADER (fixed) ── */}
            <div className="flex items-center gap-4 bg-white z-10 sticky top-0 border-b border-slate-100 px-4 py-4">
                <button
                    onClick={() => navigate("/proformainvoice")}
                    className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-100 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        Create Proforma Invoice
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Select a contract — all details fill automatically and can be edited
                    </p>
                </div>
                <div className="flex gap-3 ml-auto">
                    <button
                        type="button"
                        onClick={() => navigate("/proformainvoice")}
                        className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        {submitting
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                            : submitSuccess
                                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
                                : <><Download className="w-3.5 h-3.5" /> Create Proforma</>
                        }
                    </button>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto px-4 py-6 space-y-5">

                    {/* Error Banner */}
                    <AnimatePresence>
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium flex-1">{apiError}</span>
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
                        {submitSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-600"
                            >
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">Proforma invoice created successfully! Redirecting…</span>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* ── S1: Basic Information ── */}
                    <Section
                        icon={Info}
                        title="Basic Information"
                        subtitle="Select a contract — everything else fills automatically"
                    >

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <CustomSelect
                                label="Select Contract"
                                placeholder={loadingContracts ? "Loading…" : "Choose contract"}
                                options={(contracts ?? []).map((c) => ({
                                    id: c.id,
                                    name: c.contractNo ?? c.name ?? `Contract ${c.id}`,
                                }))}
                                value={contractId}
                                onChange={setContractId}
                                searchable
                            />
                            <InputBox
                                title="Proforma Invoice Number"
                                isMandatory
                                inputFor="proformaInvoiceNo"
                                value={form.proformaInvoiceNo}
                                handleChangeFunction={setField("proformaInvoiceNo")}
                                placeholder="12/05/DCS/2026"
                                isInputBoxDisabled={!contractId}
                            />
                            <InputBox
                                title="Invoice Date"
                                isMandatory
                                inputFor="invoiceDate"
                                type="date"
                                value={form.invoiceDate}
                                handleChangeFunction={setField("invoiceDate")}
                                isInputBoxDisabled={!contractId}
                            />
                        </div>

                        {loadingData && (
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading contract data…
                            </div>
                        )}
                    </Section>


                    {/* ── Sections that require contract data ── */}
                    <AnimatePresence>
                        {d && !loadingData && (
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
                                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 mb-4">
                                        <span className={labelCls + " mb-0"}>Buyer</span>
                                        {(d.customer) ? (
                                            <PartyCard data={d.customer} />
                                        ) : (
                                            <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-200 text-xs text-slate-300 italic">
                                                No buyer data
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PartyBlock
                                            label="Consignee"
                                            options={customerparty?.consignees?.map((e) => ({ id: e.id, name: e.name })) ?? []}
                                            value={form.consigneeid}
                                            onChange={setField("consigneeid")}
                                            selectedData={customerparty?.consignees?.find((c) => c.id === form.consigneeid)}
                                            onAdd={() => setModalSection("consignee")}
                                            loading={loadingCustomer}
                                        />
                                        <PartyBlock
                                            label="Notify Party"
                                            options={customerparty?.notifyParties?.map((e) => ({ id: e.id, name: e.name })) ?? []}
                                            value={form.notifyPartyid}
                                            onChange={setField("notifyPartyid")}
                                            selectedData={customerparty?.notifyParties?.find((n) => n.id === form.notifyPartyid)}
                                            onAdd={() => setModalSection("notifyParty")}
                                            loading={loadingCustomer}
                                        />
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <InputBox
                                            title="Buyer's Order No."
                                            inputFor="buyersOrderNo"
                                            value={d?.customerId ?? ""}
                                            isInputBoxDisabled
                                        />
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
                                            type="date"
                                            value={form.lcDate}
                                            handleChangeFunction={setField("lcDate")}
                                        />

                                    </div>
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
                                            placeholder="e.g. China"
                                        />

                                        <InputBox
                                            title="Port of Loading"
                                            isMandatory
                                            inputFor="portOfLoading"
                                            value={form.portOfLoading}
                                            handleChangeFunction={setField("portOfLoading")}
                                            placeholder="e.g. IGI Airport / New Delhi"
                                        />
                                        <InputBox
                                            title="Port of Final Destination"
                                            isMandatory
                                            inputFor="portOfFinalDestination"
                                            value={form.portOfFinalDestination}
                                            handleChangeFunction={setField("portOfFinalDestination")}
                                            placeholder="e.g. Zhengzhou, China"
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
                                            title="Operating Airlines"
                                            isMandatory
                                            inputFor="operatingAirlines"
                                            value={form.operatingAirlines}
                                            handleChangeFunction={setField("operatingAirlines")}
                                            placeholder="-"
                                        />
                                        <InputBox
                                            title="Flight No"
                                            isMandatory
                                            inputFor="flightNo"
                                            value={form.flightNo}
                                            handleChangeFunction={setField("flightNo")}
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
                                            title="Carton Weight"
                                            value="25"
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="Marks and Container No."
                                            value={`001 to ${totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"}`}
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="No. of Packages"
                                            value={totalKgs > 0 ? `${totalKgs / 25} CARTONS` : "—"}
                                            isInputBoxDisabled
                                        />
                                        <InputBox
                                            title="Shipping Marks"
                                            value="DCS"
                                            isInputBoxDisabled
                                        />
                                    </div>
                                </Section>


                                {/* ── S5: Products ── */}
                                <Section icon={Package} title="Product Details" subtitle="Products from selected contract">
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
                                                Total KGS: <span className="font-black text-slate-800">{totalKgs.toLocaleString()}</span>
                                            </span>
                                            <span className="text-slate-500">
                                                Rows: <span className="font-black text-slate-800">{contractItems.length}</span>
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className={labelCls}>Proforma Value</p>
                                            <p className="text-2xl font-black text-[#003366]">
                                                {form.currency || "US$"} {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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