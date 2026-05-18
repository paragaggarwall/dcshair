




import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft, FileText, Package, Truck,
    Loader2, AlertCircle, MapPin, Phone, Mail,
    Download, Info, UserCheck, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";


// ── Design tokens — single source of truth ────────────────────────────────────
const labelCls ="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";
const inputCls =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm " +
    "text-slate-800 placeholder-slate-400 focus:outline-none " +
    "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all min-h-[45px]";

const roCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[45px] flex items-center";

const hasVal = (v) =>
    v !== null && v !== undefined && String(v).trim() !== "";

const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);


function FieldLabel({ children, required }) {
    return (
        <label className={labelCls}>
            {children}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

function ROField({ label, value, required }) {
    const empty = !hasVal(value);
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <div className={`${roCls} ${empty ? "text-slate-300 italic" : "text-slate-800"}`}>
                {empty ? "—" : value}
            </div>
        </div>
    );
}

function EditField({ label, required, type = "text", value, onChange, placeholder }) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <input
                type={type}
                className={inputCls}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
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

function PartyCard({ label, data }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            {!data ? (
                <div className={`${roCls} text-slate-300 italic`}>Not provided</div>
            ) : (
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5 min-h-[42px]">
                    <p className="text-sm font-semibold text-slate-800">{data.name}</p>
                    {[data.address, data.city, data.state, data.country, data.pinCode].filter(Boolean).length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                            <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>
                                {[data.address, data.city, data.state, data.country, data.pinCode]
                                    .filter(Boolean).join(", ")}
                            </span>
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
            )}
        </div>
    );
}

function Grid3({ children }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {children}
        </div>
    );
}


export default function ProformaInvoiceGenerate() {

    const navigate = useNavigate();

    // contract list
    const [contracts, setContracts] = useState([]);
    const [loadingContracts, setLoadingContracts] = useState(true);

    // selected contract
    const [contractId, setContractId] = useState("");

    // contract detail data
    const [d, setD] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

    // user-entered fields
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
    const [lcnumber, setLcnumber] = useState("");
    const [lcDate, setLcDate] = useState("");
    const [airlineNo, setAirlineNo] = useState("");
    const [otherRef, setOtherRef] = useState("");

    // ui state
    const [apiError, setApiError] = useState("");
    const [generatingPdf, setGeneratingPdf] = useState(false);


    // ── Validation — ALL fields mandatory ─────────────────────────────────────
    const validateForm = useCallback(() => {
        if (!d) {
            setApiError("Please select a contract first.");
            return false;
        }

        const required = [
            { key: "Contract", value: contractId },
            { key: "Invoice Number", value: invoiceNo },
            { key: "Invoice Date", value: invoiceDate },
            { key: "LC Number", value: lcnumber },
            { key: "LC Date", value: lcDate },
            { key: "Airlines / Vessel No.", value: airlineNo },
            { key: "Other Reference(s)", value: otherRef },
            { key: "Consignee", value: d.consignee },
            { key: "Terms of Payment", value: d.termsOfPayment },
            { key: "Country of Origin", value: d.countryOfOrigin },
            { key: "Country of Destination", value: d.countryOfDestination },
            { key: "Pre-Carriage By", value: d.preCarriageBy },
            { key: "Port of Loading", value: d.portOfLoading },
            { key: "Port of Final Destination", value: d.portOfFinalDestination },
            // { key: "Description of Goods", value: d.description },
        ];

        for (const field of required) {
            if (isEmptyValue(field.value)) {
                setApiError(`${field.key} is required.`);
                return false;
            }
        }

        setApiError("");
        return true;
    }, [d, contractId, invoiceNo, invoiceDate, lcnumber, lcDate, airlineNo, otherRef]);

    useEffect(() => {
        setInvoiceNo("");
        setLcnumber("");
        setOtherRef("");
        setAirlineNo("");
    }, [contractId]);
    // ── Data fetching ──────────────────────────────────────────────────────────
    useEffect(() => {
        api.get("/proformainvoice/allcontract")
            .then((res) => setContracts(res.data))
            .catch((e) => setApiError(e?.response?.data?.error ?? e.message))
            .finally(() => setLoadingContracts(false));
    }, []);

    useEffect(() => {
        if (!contractId) { setD(null); return; }
        setLoadingData(true);
        setApiError("");
        api.get(`/proformainvoice/${contractId}/parties`)
            .then((res) => setD(res.data))
            .catch((e) => setApiError(e?.response?.data?.error ?? e.message))
            .finally(() => setLoadingData(false));
    }, [contractId]);


    // ── Derived totals ─────────────────────────────────────────────────────────
    const contractItems = d?.contractItems ?? [];

    const totalKgs = contractItems.reduce(
        (s, i) => s + (parseFloat(i.quantity) || 0), 0
    );

    const totalAmount = contractItems.reduce((s, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + qty * rate;
    }, 0);


    // ── Payload ────────────────────────────────────────────────────────────────
    const buildPayload = useCallback(() => ({
        contractId,
        invoiceNo,
        invoiceDate,
        lcnumber,
        lcDate,
        airline_no: airlineNo,
        otherRef,
        customerId: d.customerId ?? "",
        consigneeId: d.consigneeId ?? "",
        buyerId: d.buyerId ?? "",
        buyerDate: d.buyer?.createdAt
            ? new Date(d.buyer.createdAt).toLocaleDateString("en-GB")
            : "",
        notifyPartyId: d.notifyPartyId ?? "",
        contactPersonId: d.contactPersonId ?? "",
        termsOfPaymentId: d.termsOfPaymentId ?? "",
        countryOfOrigin: d.countryOfOrigin ?? "",
        countryOfFinalDestination: d.countryOfDestination ?? "",
        preCarriageBy: d.preCarriageBy ?? "",
        portOfLoading: d.portOfLoading ?? "",
        portOfFinalDestination: d.portOfFinalDestination ?? "",
        description: d.description ?? "",
        packing: totalKgs > 0 ? totalKgs / 25 : 0,
        operatingAirlines: airlineNo ?? "",
        consignee: d.consignee ?? null,
        buyer: d.buyer ?? null,
        notifyParty: d.notifyParty ?? null,
        contactPerson: d.contactPerson ?? null,
        termsOfPayment: d.termsOfPayment ?? null,
        items: contractItems.map((item) => ({
            productId: item.productId,
            name: item.product?.name ?? "",
            size: item.product?.size ?? "",
            skuCode: item.product?.skuCode ?? "",
            quantity: parseFloat(item.quantity) || 0,
            pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
            totalAmount: item.totalAmount ?? 0,
        })),
    }), [d, contractId, invoiceNo, invoiceDate, lcnumber, lcDate, airlineNo, otherRef, contractItems, totalKgs]);


    // ── PDF generation ─────────────────────────────────────────────────────────
    const handleGeneratePdf = async () => {
        if (!validateForm()) return;

        setGeneratingPdf(true);
        setApiError("");

        try {
            const res = await api.post(
                "/proformainvoice/pdfgenerate",
                buildPayload(),
                { responseType: "blob" }
            );

            const blobUrl = URL.createObjectURL(
                new Blob([res.data], { type: "application/pdf" })
            );
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `proforma-invoice-${invoiceNo || "draft"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke URL then reload to reset form
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                window.location.reload();
            }, 500);

        } catch (e) {
            const message =
                e?.response?.data instanceof Blob
                    ? await e.response.data.text().then((t) => {
                        try { return JSON.parse(t)?.error; } catch { return t; }
                    })
                    : e?.response?.data?.error ?? e.message;
            setApiError(message || "Failed to generate PDF. Please try again.");
            setGeneratingPdf(false);
        }
    };

    const canSubmit = !!d && !loadingData;


    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">

           
             {/* HEADER (fixed area) */}
    <div className="flex items-center gap-4 bg-white z-10 sticky top-0 border-b border-slate-100 px-4 py-4">
        <button
            onClick={() => navigate("/proformainvoice")}
            className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-100"
        >
            <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Generate Proforma Invoice
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
                Select a contract — all details fill automatically
            </p>
        </div>

        <div className="flex gap-3 ml-auto">
            <button
                type="button"
                onClick={() => navigate("/proformainvoice")}
                className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-100"
            >
                Cancel
            </button>

            <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={generatingPdf || !canSubmit}
                className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080]  disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
                {generatingPdf
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                    : <><Download className="w-3.5 h-3.5" /> Generate PDF</>
                }
            </button>
        </div>
    </div>
            {/* ════ SCROLLABLE CONTENT ════ */}
            <main className="flex-1 overflow-y-auto">
                <div className=" mx-auto px-4 py-6 space-y-5">

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
                                    className="text-red-400 hover:text-red-600 ml-auto flex-shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5 rotate-45" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── S1: Basic Information ── */}
                    <Section icon={Info} title="Basic Information" subtitle="Select a contract — everything else fills automatically">
                        <Grid3>
                            {/* CustomSelect needs label rendered separately to match FieldLabel style */}
                            <div>
                                <FieldLabel required>Select Contract</FieldLabel>
                                <CustomSelect
                                    placeholder="Choose contract"
                                    options={contracts.map((c) => ({
                                        id: c.id,
                                        name: c.name || c.contractNo || `Contract ${c.id}`,
                                    }))}
                                    value={contractId}
                                    onChange={setContractId}
                                    searchable
                                />
                            </div>

                            <EditField
                                label="Invoice Number"
                                required
                                value={invoiceNo}
                                onChange={setInvoiceNo}
                                placeholder="12/05/DCS/2026"
                            />

                            <EditField
                                label="Invoice Date"
                                required
                                type="date"
                                value={invoiceDate}
                                onChange={setInvoiceDate}
                            />
                        </Grid3>

                        {loadingData && (
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading contract data…
                            </div>
                        )}
                    </Section>

                    {/* ── Sections animate in once data arrives ── */}
                    <AnimatePresence>
                        {d && !loadingData && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-5"
                            >

                                {/* ── S2: Parties ── */}
                                <Section icon={UserCheck} title="Parties" subtitle="Consignee, Buyer, Notify Party & Contact Person">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PartyCard label="Consignee" data={d.consignee} />
                                        <PartyCard label="Buyer" data={d.buyer} />
                                        <PartyCard label="Notify Party" data={d.notifyParty} />
                                        <PartyCard label="Contact Person" data={d.contactPerson} />
                                    </div>
                                </Section>

                                {/* ── S3: Invoice Information ── */}
                                <Section icon={FileText} title="Invoice Information" subtitle="Reference numbers & dates from contract">
                                    <Grid3>
                                        <ROField label="Terms of Payment" required value={d.termsOfPayment?.name} />
                                        <ROField label="Buyer's Order No." required value={d.buyerId} />
                                        <ROField
                                            label="Buyer Order Date"
                                            required
                                            value={d.buyer?.createdAt
                                                ? new Date(d.buyer.createdAt).toLocaleDateString("en-GB")
                                                : ""}
                                        />
                                        <EditField
                                            label="LC Number"
                                            required
                                            value={lcnumber}
                                            onChange={setLcnumber}
                                            placeholder="Enter LC / No."
                                        />
                                        <EditField
                                            label="LC Date"
                                            required
                                            type="date"
                                            value={lcDate}
                                            onChange={setLcDate}
                                        />
                                        <EditField
                                            label="Other Reference(s)"
                                            required
                                            value={otherRef}
                                            onChange={setOtherRef}
                                            placeholder="Enter reference"
                                        />
                                    </Grid3>
                                </Section>

                                {/* ── S4: Shipping & Delivery ── */}
                                <Section icon={Truck} title="Shipping & Delivery" subtitle="Transport and delivery details from contract">
                                    <Grid3>
                                        <ROField label="Country of Origin" required value={d.countryOfOrigin} />
                                        <ROField label="Country of Destination" required value={d.countryOfDestination} />
                                        <ROField label="Pre-Carriage By" required value={d.preCarriageBy} />
                                        <ROField label="Port of Loading" required value={d.portOfLoading} />
                                        <ROField label="Port of Final Destination" required value={d.portOfFinalDestination} />
                                        <ROField
                                            label="Packing Details"
                                            required
                                            value={totalKgs > 0 ? `${totalKgs / 25} CARTONS` : ""}
                                        />
                                        <ROField label="Description of Goods"  value={d.description} />
                                        <EditField
                                            label="Airlines / Vessel No."
                                            required
                                            value={airlineNo}
                                            onChange={setAirlineNo}
                                            placeholder="Enter Airline / Vessel No."
                                        />
                                    </Grid3>
                                </Section>

                                {/* ── S5: Products ── */}
                                <Section icon={Package} title="Product Details" subtitle="Products from contract">

                                    {/* Column headers */}
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

                                    {/* Totals footer */}
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
        </div>
    );
}