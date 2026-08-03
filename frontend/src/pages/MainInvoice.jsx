


import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Landmark, FileText, Ship, Truck, ChevronRight, Save, Loader2,
} from "lucide-react";
import CustomSaleDetails from "./CustomSaleDetails";
import ShippingDetails from "./ShippingDetails";
import BankSaleDetails from "./BankSale";
import ShipmentTrackingForm from "./ShippingTracking"
import InvoiceDetails from "./InvoiceDetails";
import {
    useUpdateAllInvoiceDetailMutation,
    useGetInvoiceByIdQuery,
    useGetInvoicesQuery,
} from "./shippingDetailsAPI/ShippingDetailsApislice";
import CustomSelect from "../components/CustomSelect";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TABS = [
    {
        id: "invoice-details",
        label: "Invoice Details",
        shortLabel: "Invoice",
        icon: Ship,
        component: InvoiceDetails,
    },
    {
        id: "shipping-details",
        label: "Shipping Details",
        shortLabel: "Shipping",
        icon: Ship,
        component: ShippingDetails,
    },
    {
        id: "shipment-tracking",
        label: "Shipment Tracking",
        shortLabel: "Tracking",
        icon: Truck,
        component: ShipmentTrackingForm,
    },
    {
        id: "custom-sale",
        label: "Custom Sale",
        shortLabel: "Custom",
        icon: FileText,
        component: CustomSaleDetails,
    },
    {
        id: "bank-sale",
        label: "Bank Sale",
        shortLabel: "Bank",
        icon: Landmark,
        component: BankSaleDetails,
    },

];


export const allForm = {
    // Invoice model
    id: null,
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    customerId: null,
    contractId: null,
    proformaInvoiceId: null,
    proformaInvoiceNo: null,
    consigneeId: null,
    notifyPartyId: null,
    contactPersonId: null,
    termsOfPaymentId: null,
    preCarriageBy: "",
    invoicepaymentterm: "",
    operatingAirlines: "",
    countryOfOrigin: "",
    countryOfDestination: "",
    sizeScale: "",
    packing: "",
    portOfLoading: "",
    portOfFinalDestination: "",
    otherRefrence: "",
    cartonWeight: "",
    currency: "USD",
    totalAmount: "",
    // Shipping Details + Tracking Details
    shippingBillNo: "",
    shippingDate: "",
    awbNo: "",
    awbNoDate: "",
    grossWeight: "",
    narration: "",
    cha: "",
    stockOutFromPKSGodown: false,
    stockOutDateTime: "",
    factoryCode: "",
    lorryNo: "",
    shipmentTakenBy: "",
    shipmentHandedOverTo: "",
    lorryInCustomWarehouse: false,
    lorryInCustomWarehouseDateTime: "",
    lorryOutFromCustomWarehouse: false,
    lorryOutFromCustomWarehouseDateTime: "",
    passedShipmentFromCustom: false,
    passedShipmentFromCustomDate: "",
    containerNo: "",
    containerStuffing: false,
    containerStuffingDate: "",
    containerSealNo: "",
    flightNo: "",
    trainNo: "",
    trainOut: false,
    trainOutDateTime: "",
    dispatchDate: "",
    transporterName: "",
    vehicleNo: "",
    driverName: "",
    driverPhone: "",
    ewayBillNo: "",
    lrNo: "",
    delivered: false,
    deliveredDate: "",
    deliveryNarration: "",
    customSale: {
        amount: "",
        customExchangeRate: "",
        shippingBillNo: "",
        shippingBillDate: "",
        cifCfrValue: "",
        lessFreight: "",
        lessInsurance: "",
        lessCommission: "",
        customFobValue: "",
        drawBackPercentage: "",
        drawBackValue: "",
        drawBackDateReceived: "",
        drawBackNarration: "",
        focusPercentage: "",
        focusValue: "",
        focusDateReceived: "",
    },
    bankSale: {
        amount: "",
        bankExchangeRate: "",
        bankRefNo: "",
        bankRefDate: "",
        negotiationAmount: "",
        lessFreight: "",
        lessInsurance: "",
        lessCommissionIfAny: "",
        bankFobValue: "",
        dateOfRealisation: "",
        realisationNarration: "",
        realisationdueDate: "",
        courierCompany: "",
        trackingNo: "",
    },
    items: [],
};

export default function MainInvoice() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [dirtyData, setDirtyData] = useState({});
    const activeConfig = TABS.find((t) => t.id === activeTab);
    const ActiveComponent = activeConfig?.component ?? null;
    const { data: getMyInvoices, isLoading: invoicesLoading } = useGetInvoicesQuery();
    const invoicesData = getMyInvoices?.data ?? [];
    const invoiceOptions = invoicesData.map((inv) => ({ id: inv.id, name: inv.invoiceNo }));
    const { data: invoiceDetail, isFetching: invoiceFetching, refetch, } = useGetInvoiceByIdQuery(selectedInvoiceId, { skip: !selectedInvoiceId });
    const originalData = invoiceDetail?.data ?? invoiceDetail ?? null;
    const [updateAllInvoiceDetail, { isLoading: isSaving }] = useUpdateAllInvoiceDetailMutation();
    const [bigform, setbigform] = useState(allForm);

    useEffect(() => {
        if (!originalData) return;

        const d = originalData;

        setbigform({
            ...allForm,
            id: d.id,
            invoiceNo: d.invoiceNo || "",
            invoiceDate: d.invoiceDate?.split("T")[0] || "",
            customerId: d.customerId,
            contractId: d.contractId,
            proformaInvoiceId: d.proformaInvoiceId,
            proformaInvoiceNo: d?.proformaInvoice?.proformaInvoiceNo,
            consigneeId: d.consigneeId,
            notifyPartyId: d.notifyPartyId,
            contactPersonId: d.contactPersonId,
            termsOfPaymentId: d.termsOfPaymentId,
            invoicepaymentterm: d.invoicepaymentterm || "",
            preCarriageBy: d.preCarriageBy || "",
            operatingAirlines: d.operatingAirlines || "",
            countryOfOrigin: d.countryOfOrigin || "",
            countryOfDestination: d.countryOfDestination || "",
            packing: d.packing || "",
            portOfLoading: d.portOfLoading || "",
            portOfFinalDestination: d.portOfFinalDestination || "",
            otherRefrence: d.otherRefrence || "",
            currency: d.currency || "USD",
            totalAmount: d.totalAmount || "",
            shippingBillNo: d.shippingBillNo || "",
            shippingDate: d.shippingDate?.split("T")[0] || "",
            awbNo: d.awbNo || "",
            awbNoDate: d.awbNoDate?.split("T")[0] || "",
            grossWeight: d.grossWeight || "",
            narration: d.narration || "",
            cha: d.cha || "",
            stockOutFromPKSGodown: d.stockOutFromPKSGodown || false,
            stockOutDateTime: d.stockOutDateTime?.split("T")[0] || "",
            factoryCode: d.factoryCode || "",
            lorryNo: d.lorryNo || "",
            shipmentTakenBy: d.shipmentTakenBy || "",
            shipmentHandedOverTo: d.shipmentHandedOverTo || "",
            lorryInCustomWarehouse: d.lorryInCustomWarehouse || false,
            lorryInCustomWarehouseDateTime: d.lorryInCustomWarehouseDateTime?.split("T")[0] || "",
            lorryOutFromCustomWarehouse: d.lorryOutFromCustomWarehouse || false,
            lorryOutFromCustomWarehouseDateTime: d.lorryOutFromCustomWarehouseDateTime?.split("T")[0] || "",
            passedShipmentFromCustom: d.passedShipmentFromCustom || false,
            passedShipmentFromCustomDate: d.passedShipmentFromCustomDate?.split("T")[0] || "",
            containerNo: d.containerNo || "",
            containerStuffing: d.containerStuffing || false,
            containerStuffingDate: d.containerStuffingDate?.split("T")[0] || "",
            containerSealNo: d.containerSealNo || "",
            flightNo: d.flightNo || "",
            trainNo: d.trainNo || "",
            trainOut: d.railOut || false,
            trainOutDateTime: d.railOutDateTime?.split("T")[0] || "",
            dispatchDate: d.dispatchDate?.split("T")[0] || "",
            transporterName: d.transporterName || "",
            vehicleNo: d.vehicleNo || "",
            driverName: d.driverName || "",
            driverPhone: d.driverPhone || "",
            ewayBillNo: d.ewayBillNo || "",
            lrNo: d.lrNo || "",
            delivered: d.delivered || false,
            deliveredDate: d.deliveredDate?.split("T")[0] || "",
            deliveryNarration: d.deliveryNarration || "",
            customSale: d.customSale
                ? {
                    ...allForm.customSale,
                    ...d.customSale,
                    shippingBillDate: d.customSale.shippingBillDate?.split("T")[0] || "",
                    drawBackDateReceived: d.customSale.drawBackDateReceived?.split("T")[0] || "",
                    focusDateReceived: d.customSale.focusDateReceived?.split("T")[0] || "",
                }
                : allForm.customSale,

            bankSale: d.bankSales
                ? {
                    ...allForm.bankSale,
                    ...d.bankSales,
                    bankRefDate: d.bankSales.bankRefDate?.split("T")[0] || "",
                    dateOfRealisation: d.bankSales.dateOfRealisation?.split("T")[0] || "",
                    realisationdueDate: d.bankSales.realisationdueDate?.split("T")[0] || "",
                }
                : allForm.bankSale,


            items: d.items || [],
        });

        setDirtyData({});
    }, [originalData]);


    useEffect(() => {
        console.log("bigform updated", bigform);
    }, [bigform]);


    const handleInvoiceChange = useCallback((id) => {
        setSelectedInvoiceId(id);
        setDirtyData({});
    }, []);

    const handleCancel = useCallback(() => {
        setDirtyData({});
        navigate(-1);
    }, [navigate]);

    // const markDirty = useCallback((key, value) => {
    //     setDirtyData((prev) => ({ ...prev, [key]: value }));
    // }, []);
    const markDirty = useCallback((key, value) => {
        setDirtyData((prev) => {
            const updated = { ...prev };

            const originalValue = key
                .split(".")
                .reduce((obj, k) => obj?.[k], originalData);

            const isNumeric = (v) =>
                v !== null &&
                v !== undefined &&
                v !== "" &&
                !Number.isNaN(Number(v));

            const isEqual = isNumeric(originalValue) && isNumeric(value)
                ? Number(originalValue) === Number(value)
                : String(originalValue ?? "") === String(value ?? "");

            if (isEqual) {
                delete updated[key];
            } else {
                updated[key] = value;
            }

            return updated;
        });
    }, [originalData]);

    const buildNestedPayload = (dirtyData) => {
        const result = {};

        Object.entries(dirtyData).forEach(([key, value]) => {
            const keys = key.split("."); // ["customSale", "shippingBillNo"]

            let current = result;

            keys.forEach((k, index) => {
                if (index === keys.length - 1) {
                    current[k] = value;
                } else {
                    if (!current[k]) current[k] = {};
                    current = current[k];
                }
            });
        });

        return result;
    };

    const handleSave = async () => {
        if (!originalData?.id || Object.keys(dirtyData).length === 0) {
            toast("No changes to save.");
            return;
        }
        try {
            // console.log("dsgsfvergv", dirtyData);
            const payload = buildNestedPayload(dirtyData);
            const res = await updateAllInvoiceDetail({
                id: selectedInvoiceId,
                body: payload,
            }).unwrap();
            toast.success("Invoice saved successfully!");
            setDirtyData({});
            refetch();
        } catch (e) {
            toast.error(e?.data?.error ?? e?.data?.message ?? e?.message ?? "Failed to save.");
        }
    };

    useEffect(() => {
        if (location.state?.selectedInvoiceId) {
            setSelectedInvoiceId(location.state.selectedInvoiceId);
        }
    }, [location.state]);

    const hasDirty = Object.keys(dirtyData).length > 0;

    return (
        <div className="flex flex-col overflow-hidden h-screen bg-slate-100">

            {/* ══ TOP HEADER BAR ══════════════════════════════════════════════ */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm z-30">

                {/* Brand + invoice selector + actions */}
                <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-sm font-bold text-slate-800 tracking-wide">Invoice Management</h1>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-500 truncate">
                            {activeConfig?.label}
                        </span>
                    </div>

                    {/* Invoice selector */}
                    <div className="ml-auto w-64">
                        {/* <CustomSelect
                            options={invoiceOptions}
                            value={selectedInvoiceId}
                            onChange={handleInvoiceChange}
                            placeholder={invoicesLoading ? "Loading invoices…" : "Select Invoice No."}
                            searchable
                        /> */}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleCancel}
                            // disabled={!hasDirty}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!hasDirty || isSaving || invoiceFetching}
                            className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            {isSaving
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                                : <><Save className="w-3.5 h-3.5" /> Save</>
                            }
                        </button>
                    </div>
                </div>

                {/* Tab row */}

                <div className="flex-1 flex justify-evenly items-center w-ful gap-1 p-1 m-2 rounded-xl bg-slate-50 border border-[#003366]/20 shadow-sm">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                    relative flex-1 flex items-center justify-center gap-2 px-5 py-2
          rounded-lg text-xs font-semibold transition-all duration-200
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[#003366]/60 cursor-pointer
                    ${isActive
                                        ? "text-[#003366]"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                                    }
                `}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="tab-active-bg"
                                        className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_3px_rgba(0,51,102,0.15)]"
                                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                    />
                                )}

                                <Icon className={`relative z-10 w-3.5 h-3.5 flex-shrink-0 transition-colors ${isActive ? "text-[#003366]" : "text-slate-400"}`} />
                                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                                <span className="relative z-10 sm:hidden">{tab.shortLabel}</span>

                                {/* dirty indicator dot */}
                                {isActive && hasDirty && (
                                    <span className="relative z-10 flex-shrink-0 w-1.5 h-1.5">
                                        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
                                        <span className="relative w-1.5 h-1.5 rounded-full bg-amber-500 block" />
                                    </span>
                                )}

                                {isActive && (
                                    <motion.span
                                        layoutId="tab-underline"
                                        className="absolute -bottom-1 left-3 right-3 h-0.5 bg-[#003366] rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ══ TAB CONTENT ════════════════════════════════════════════════ */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="h-screen overflow-hidden"
                    >
                        {ActiveComponent && (
                            <ActiveComponent
                                selectedInvoiceId={selectedInvoiceId}
                                setSelectedInvoiceId={setSelectedInvoiceId}
                                originalData={originalData}
                                invoiceFetching={invoiceFetching}
                                refetch={refetch}
                                dirtyData={dirtyData}
                                markDirty={markDirty}
                                setDirtyData={setDirtyData}
                                form={bigform}
                                setform={setbigform}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>


        </div>
    );
}
