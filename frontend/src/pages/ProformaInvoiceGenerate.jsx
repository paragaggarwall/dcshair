


import { useState, useRef, useEffect } from "react";
import {
    ArrowLeft, FileText, Package, Truck,
    Search, ChevronDown, Loader2, Check,
    AlertCircle, MapPin, Phone, Mail,
    Download, Info, UserCheck, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";


// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (v) => (v ? v.split("T")[0] : "");
const hasVal = (v) => v !== null && v !== undefined && String(v).trim() !== "";


// ── ContractSelect ────────────────────────────────────────────────────────────
function ContractSelect({ options = [], value, onChange, loading = false }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    const selected = options.find((o) => o.id?.toString() === value?.toString()) ?? null;

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const filtered = options.filter((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={ref}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Contract <span className="text-red-400">*</span>
            </label>
            <button
                type="button"
                disabled={loading}
                onClick={() => !loading && setOpen((p) => !p)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
                    ${open ? "ring-2 ring-blue-500/20 border-blue-400 bg-white" : "border-slate-200 bg-slate-50 hover:bg-white"}
                    ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <span className={`truncate ${selected ? "text-slate-800 font-medium" : "text-slate-400"}`}>
                    {loading ? "Loading…" : selected ? selected.name : "Select Contract…"}
                </span>
                {loading
                    ? <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin flex-shrink-0" />
                    : <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                }
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="p-2.5 border-b border-slate-50">
                            <div className="relative">
                                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search…"
                                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-blue-300 transition-all"
                                />
                            </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                            {filtered.length === 0
                                ? <p className="p-4 text-center text-xs text-slate-400 italic">No results found</p>
                                : filtered.map((opt) => {
                                    const isSel = value?.toString() === opt.id?.toString();
                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => { onChange(opt.id); setOpen(false); setSearch(""); }}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                                ${isSel ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50 text-slate-700"}`}
                                        >
                                            <span className="truncate">{opt.name}</span>
                                            {isSel && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 ml-2" />}
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


// ── Read-only display primitives ──────────────────────────────────────────────
const roBase = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-h-[42px]";

function ROField({ label, value, required }) {
    const empty = !hasVal(value);
    return (
        <div>
            {label && (
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
            )}
            <div className={`${roBase} flex items-center ${empty ? "text-slate-300 italic" : "text-slate-800"}`}>
                {empty ? "—" : value}
            </div>
        </div>
    );
}

function ROTextarea({ label, value, rows = 2 }) {
    const empty = !hasVal(value);
    return (
        <div>
            {label && (
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    {label}
                </label>
            )}
            <div
                className={`${roBase} whitespace-pre-wrap ${empty ? "text-slate-300 italic" : "text-slate-800"}`}
                style={{ minHeight: `${rows * 1.75 + 1.25}rem` }}
            >
                {empty ? "—" : value}
            </div>
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

// Party info card — shows name, address, phone, email
function PartyCard({ label, data }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            {!data ? (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-300 italic">
                    Not provided
                </div>
            ) : (
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
            )}
        </div>
    );
}


// ── Main Component ────────────────────────────────────────────────────────────
export default function ProformaInvoiceGenerate() {
    
    const navigate = useNavigate();

    // contract list for the dropdown
    const [contracts, setContracts] = useState([]);
    const [loadingContracts, setLoadingContracts] = useState(true);

    // selected contract id (only user interaction besides invoice no/date)
    const [contractId, setContractId] = useState("");

    // full data object returned by /proformainvoice/:id/parties
    // shape matches the JSON you provided
    const [d, setD] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

    // the only two fields the user enters themselves
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);

    // ui
    const [apiError, setApiError] = useState("");
    const [saving, setSaving] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // ── fetch contract list ───────────────────────────────────────────────────
    useEffect(() => {
        api.get("/proformainvoice/allcontract")
            .then((res) => setContracts(res.data))
            .catch((e) => setApiError(e?.response?.data?.error || e.message))
            .finally(() => setLoadingContracts(false));
    }, []);

    // ── fetch contract detail on selection ────────────────────────────────────
    useEffect(() => {
        if (!contractId) { setD(null); return; }
        setLoadingData(true);
        setApiError("");
        api.get(`/proformainvoice/${contractId}/parties`)
            .then((res) => setD(res.data))
            .catch((e) => setApiError(e?.response?.data?.error || e.message))
            .finally(() => setLoadingData(false));
    }, [contractId]);

    // ── derived values ────────────────────────────────────────────────────────
    const contractItems = d?.contractItems ?? [];

    const totalKgs = contractItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);

    const totalAmount = contractItems.reduce((s, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const rate = parseFloat(i.pricePerKg ?? i.product?.pricePerKg) || 0;
        return s + qty * rate;
    }, 0);

    // ── payload — all values from d, only invoiceNo/Date from local state ─────
    const buildPayload = () => ({
        contractId,
        invoiceNo,
        invoiceDate,
        // ids
        customerId: d.customerId ?? "",
        consigneeId: d.consigneeId ?? "",
        buyerId: d.buyerId ?? "",
        notifyPartyId: d.notifyPartyId ?? "",
        contactPersonId: d.contactPersonId ?? "",
        termsOfPaymentId: d.termsOfPaymentId ?? "",
        // logistics
        countryOfOrigin: d.countryOfOrigin ?? "",
        countryOfDestination: d.countryOfDestination ?? "",
        description: d.description ?? "",
        packing: d.packing ?? "",
        insurance: d.insurance ?? "",
        preCarriageBy: d.preCarriageBy ?? "",
        portOfLoading: d.portOfLoading ?? "",
        portOfFinalDestination: d.portOfFinalDestination ?? "",
        operatingAirlines: d.operatingAirlines ?? "",
        speacialCondition: d.speacialCondition ?? "",
        note: d.note ?? "",
        deliveryTerms: d.deliveryTerms ?? "",
        expectedDepartureDate: fmtDate(d.expectedDepartureDate),
        expectedDeliveryDate: fmtDate(d.expectedDeliveryDate),
        // nested objects
        consignee: d.consignee ?? null,
        buyer: d.buyer ?? null,
        notifyParty: d.notifyParty ?? null,
        contactPerson: d.contactPerson ?? null,
        termsOfPayment: d.termsOfPayment ?? null,
        // line items
        items: contractItems.map((item) => ({
            productId: item.productId,
            name: item.product?.name ?? "",
            skuCode: item.product?.skuCode ?? "",
            quantity: parseFloat(item.quantity) || 0,
            pricePerKg: parseFloat(item.pricePerKg ?? item.product?.pricePerKg) || 0,
            totalAmount: item.totalAmount ?? 0,
        })),
    });

    const canSubmit = !!d && !loadingData;

    
    // ── generate PDF ──────────────────────────────────────────────────────────
    const handleGeneratePdf = async () => {
        if (!canSubmit) return;
        setGeneratingPdf(true); setApiError("");
        try {
            const res = await api.post("/proformainvoice/pdfgenerate", buildPayload(), { responseType: "blob" });
            const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `proforma-invoice-${invoiceNo || "draft"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            setApiError(e?.response?.data?.error || e.message);
        } finally { setGeneratingPdf(false); }
    };

    // ── success screen ────────────────────────────────────────────────────────
    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Draft Saved!</h2>
                    <p className="text-sm text-slate-400 mb-6">Contract saved. You can generate the PDF any time.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate("/contracts")}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Back to List
                        </button>
                        <button onClick={() => setSubmitSuccess(false)}
                            className="bg-[#003366] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors">
                            Continue Editing
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── RENDER ────────────────────────────────────────────────────────────────
    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8 pb-32 space-y-5">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/proformainvoice")}
                        className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-100">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Generate Proforma Invoice</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Select a contract — all details fill automatically</p>
                    </div>
            
                     
                    <div className="flex gap-3 ml-auto">

<button type="button" onClick={() => navigate('/proformainvoice')}
            className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-100">
            Cancel
          </button>
                    </div>

                    <div className="flex gap-3 ml-auto">


                        <button
                            type="button"
                            onClick={handleGeneratePdf}
                            disabled={generatingPdf || !canSubmit}
                            className="flex items-center gap-2 bg-[#003366] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                            {generatingPdf
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                                : <><Download className="w-3.5 h-3.5" /> Generate PDF</>
                            }
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {apiError && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium flex-1">{apiError}</span>
                            <button onClick={() => setApiError("")} className="text-red-400 hover:text-red-600 ml-auto">
                                <Plus className="w-3.5 h-3.5 rotate-45" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── S1: Contract picker + Invoice No / Date ── */}
                <Section icon={Info} title="Basic Information" subtitle="Select a contract — everything else fills automatically">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Contract — interactive */}
                        <ContractSelect
                            options={contracts.map((c) => ({
                                id: c.id,
                                name: c.name || c.contractNo || `Contract ${c.id}`,
                            }))}
                            value={contractId}
                            onChange={setContractId}
                            loading={loadingContracts}
                        />

                        {/* Invoice No — user enters */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                Invoice Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                                placeholder="12/05/DCS/2026"
                            />
                        </div>

                        {/* Invoice Date — user enters */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loadingData && (
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading contract data…
                        </div>
                    )}
                </Section>

                {/* ── Sections below animate in once data arrives ── */}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <PartyCard label="Consignee" data={d.consignee} />
                                    <PartyCard label="Buyer" data={d.buyer} />
                                    <PartyCard label="Notify Party" data={d.notifyParty} />
                                    <PartyCard label="Contact Person" data={d.contactPerson} />
                                </div>
                            </Section>

                            {/* ── S3: Invoice Information ── */}
                            <Section icon={FileText} title="Invoice Information" subtitle="Reference numbers & dates from contract">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <ROField label="Terms of Payment" required value={d.termsOfPayment?.name} />
                                    <ROField label="Buyer's Order No." value={d.buyerOrderNo} />
                                    <ROField label="Buyer Order Date" value={fmtDate(d.buyerOrderDate)} />
                                    <ROField label="Exporter's Ref." value={d.exporterRef} />
                                    <ROField label="LC Number" value={d.lcNo} />
                                    <ROField label="LC Date" value={fmtDate(d.lcDate)} />
                                    <ROField label="Other Reference(s)" value={d.otherRef} />
                                </div>
                            </Section>

                            {/* ── S4: Shipping & Delivery ── */}
                            <Section icon={Truck} title="Shipping & Delivery" subtitle="Transport and delivery details from contract">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <ROField label="Country of Origin" required value={d.countryOfOrigin} />
                                    <ROField label="Country of Destination" required value={d.countryOfDestination} />
                                    <ROField label="Pre-Carriage By" value={d.preCarriageBy} />
                                    <ROField label="Port of Loading" value={d.portOfLoading} />
                                    <ROField label="Port of Final Destination" value={d.portOfFinalDestination} />
                                    <ROField label="Airlines / Vessel No." value={d.operatingAirlines} />
                                    <ROField label="Delivery Terms" value={d.deliveryTerms} />
                                    <ROField label="Expected Departure" value={fmtDate(d.expectedDepartureDate)} />
                                    <ROField label="Expected Delivery" value={fmtDate(d.expectedDeliveryDate)} />
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ROTextarea label="Packing Details" value={d.packing} />
                                    <ROTextarea label="Insurance" value={d.insurance} />
                                    <ROTextarea label="Description of Goods" value={d.description} />
                                    <ROTextarea label="Special Conditions" value={d.speacialCondition} />
                                    <ROTextarea label="Please Note" value={d.note} />
                                </div>
                            </Section>

                            {/* ── S5: Products ── */}
                            <Section icon={Package} title="Product Details" subtitle="Products from contract">

                                {/* Column headers */}
                                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 mb-2 px-1">
                                    {["Product", "Qty (KGS)", "Rate (US$/KGS)", "Amount (US$)"].map((h, i) => (
                                        <p key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</p>
                                    ))}
                                </div>

                                {contractItems.length === 0 ? (
                                    <p className="text-sm text-slate-300 italic py-4 text-center">No products on this contract</p>
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
                                                    className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-start"
                                                >
                                                    {/* Product name + SKU */}
                                                    <div className={`${roBase} text-slate-800`}>
                                                        <p className="font-medium leading-snug">{prod?.name ?? "—"}</p>
                                                        {prod?.skuCode && (
                                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                                SKU: <span className="font-semibold text-slate-500">{prod.skuCode}</span>
                                                                {prod.size && <> · <span className="font-semibold text-slate-500">{prod.size}</span></>}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {/* Qty */}
                                                    <div className={`${roBase} text-right flex items-center justify-end ${qty === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
                                                        {qty === 0 ? "—" : qty.toLocaleString()}
                                                    </div>
                                                    {/* Rate */}
                                                    <div className={`${roBase} text-right flex items-center justify-end ${rate === 0 ? "text-slate-300 italic" : "text-slate-800"}`}>
                                                        {rate === 0 ? "—" : rate.toFixed(2)}
                                                    </div>
                                                    {/* Amount */}
                                                    <div className={`${roBase} text-right flex items-center justify-end font-bold ${total === 0 ? "text-slate-300 italic" : "text-slate-700"}`}>
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
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Invoice Value</p>
                                        <p className="text-2xl font-black text-[#003366]">
                                            US$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </Section>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Sticky Bottom Bar ── */}
                {/* <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-xl z-40">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        <div className="hidden sm:flex items-center gap-4 overflow-hidden">
                            {d && (
                                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                                    <span className="text-blue-400 text-xs">Total</span>
                                    <span className="font-black text-xs text-[#003366]">
                                        US$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 ml-auto">
                          

                            <button
                                type="button"
                                onClick={handleGeneratePdf}
                                disabled={generatingPdf || !canSubmit}
                                className="flex items-center gap-2 bg-[#003366] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
                            >
                                {generatingPdf
                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                                    : <><Download className="w-3.5 h-3.5" /> Generate PDF</>
                                }
                            </button>
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
}