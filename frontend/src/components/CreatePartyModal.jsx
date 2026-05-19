

import React, { useState, useEffect } from "react";
import {
    X, User, Mail, Phone, Home, Building, Map, Globe, Hash,
    AlertCircle, Check, Loader2, BadgeCheck, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMPTY = {
    name: "", email: "", phone: "", altPhone: "",
    address: "", city: "", state: "", country: "", pinCode: "",
};



const IDENTITY_FIELDS = [
    { key: "name", label: "Full name", placeholder: "e.g. Acme Corp Ltd", icon: User, required: true, span: 2 },
];

const CONTACT_FIELDS = [
    { key: "email", label: "Email", placeholder: "ops@acme.com", icon: Mail, span: 2 },
    { key: "phone", label: "Phone", placeholder: "+91 98765 43210", icon: Phone, span: 1 },
    { key: "altPhone", label: "Alt. phone", placeholder: "Optional", icon: Phone, span: 1 },
];

const ADDRESS_FIELDS = [
    { key: "address", label: "Street address", placeholder: "Building, street, area…", icon: Home, span: 2, multiline: true },
    { key: "city", label: "City", placeholder: "e.g. Mumbai", icon: Building, span: 1 },
    { key: "state", label: "State", placeholder: "e.g. Maharashtra", icon: Map, span: 1 },
    { key: "country", label: "Country", placeholder: "e.g. India", icon: Globe, span: 1 },
    { key: "pinCode", label: "PIN / ZIP", placeholder: "e.g. 400001", icon: Hash, span: 1 },
];

const FORM_CONFIG = {
    consignee: {
        identity: IDENTITY_FIELDS,
        contact: CONTACT_FIELDS,
        address: ADDRESS_FIELDS,
    },
    buyer: {
        identity: IDENTITY_FIELDS,
        contact: CONTACT_FIELDS,
        address: ADDRESS_FIELDS,
    },
    "notify party": {
        identity: IDENTITY_FIELDS,
        contact: CONTACT_FIELDS,
        address: ADDRESS_FIELDS,
    },
    "contact person": {
        identity: IDENTITY_FIELDS,
        contact: CONTACT_FIELDS,
        address: [], // no address fields
    },
};

function Field({ f, value, error, onChange }) {
    const Icon = f.icon;
    const [focused, setFocused] = useState(false);

    const ringStyle = focused
        ? { borderColor: error ? "#fca5a5" : "#93c5fd", boxShadow: `0 0 0 3px ${error ? "#fee2e2" : "#eff6ff"}` }
        : error ? { borderColor: "#fca5a5" } : {};

    const base = "w-full pl-9 pr-3 text-[13px] text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder:text-gray-300 transition-all";

    return (
        <div className="flex flex-col gap-[5px]">
            <label className="text-[13px] font-medium  flex items-center gap-2">
                <Icon className="w-[13px] h-[13px] text-gray-400" />
                {f.label}
                {f.required && <span className="text-red-400 text-[11px]">*</span>}
            </label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-gray-300 pointer-events-none" />
                {f.multiline ? (
                    <textarea
                        value={value} rows={2} placeholder={f.placeholder}
                        onChange={e => onChange(e.target.value)}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        style={ringStyle}
                        className={`${base} pt-[9px] pb-[9px] resize-none`}
                    />
                ) : (
                    <input
                        type="text" value={value} placeholder={f.placeholder}
                        onChange={e => onChange(e.target.value)}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        style={ringStyle}
                        className={`${base} py-[8px]`}
                    />
                )}
            </div>
        </div>
    );
}



export default function CreatePartyModal({ open, onClose, onSave, title = "Consignee" }) {
    const tt = title.replace(/create new /i, "").trim();
    console.log('rg', tt);


    const config = FORM_CONFIG[tt];
    const [form, setForm] = useState(EMPTY);
    const [nameError, setNameError] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (open) { setForm(EMPTY); setNameError(false); setSaved(false); setGlobalError(""); }
    }, [open]);

    const set = (key, val) => {
        setForm(p => ({ ...p, [key]: val }));
        if (key === "name") { setNameError(false); setGlobalError(""); }
    };


    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setNameError(true);
            setGlobalError("Full name is required before saving.");
            return;
        }

        setLoading(true);
        setGlobalError("");

        try {
            const allowedKeys = [
                ...(config.identity || []),
                ...(config.contact || []),
                ...(config.address || []),
            ].map(f => f.key);

            const filteredPayload = Object.fromEntries(
                Object.entries(form).filter(([key]) => allowedKeys.includes(key))
            );

            await onSave(filteredPayload);

            setSaved(true);
            setTimeout(onClose, 700);
        } catch (err) {
            setGlobalError(err?.response?.data?.error || err.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };


    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <motion.div
                        initial={{ scale: 0.97, opacity: 0, y: 8 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.97, opacity: 0, y: 8 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className="w-full max-w-[700px] mx-4 bg-white rounded-2xl overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <BadgeCheck className="w-[18px] h-[18px]" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">New party</p>
                                    <p className="text-[15px] font-semibold text-gray-800 leading-none">{title}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-[14px] h-[14px]" />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Body */}
                        {/* <div className="px-6 py-5 flex flex-col gap-5 max-h-[68vh] overflow-y-auto">

                <Field f={IDENTITY_FIELDS[0]} value={form.name} error={nameError} onChange={v => set("name", v)} />
             

                <div className="grid grid-cols-2 gap-3">
                  {CONTACT_FIELDS.map(f => (
                    <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                      <Field f={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {ADDRESS_FIELDS.map(f => (
                    <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                      <Field f={f} value={form[f.key]} onChange={v => set(f.key, v)} />
                    </div>
                  ))}
                </div>

              {globalError && (
                <div className="flex items-center gap-2 text-[13px] text-red-500 font-medium -mt-1">
                  <AlertCircle className="w-[14px] h-[14px] shrink-0" />
                  {globalError}
                </div>
              )}

            </div> */}
                        <div className="px-6 py-5 flex flex-col gap-5 max-h-[68vh] overflow-y-auto">
                            {/* Identity */}
                            {config.identity?.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {config.identity.map((f) => (
                                        <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                                            <Field
                                                f={f}
                                                value={form[f.key]}
                                                error={f.key === "name" ? nameError : false}
                                                onChange={(v) => set(f.key, v)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Contact */}
                            {config.contact?.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {config.contact.map((f) => (
                                        <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                                            <Field
                                                f={f}
                                                value={form[f.key]}
                                                onChange={(v) => set(f.key, v)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Address */}
                            {config.address?.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {config.address.map((f) => (
                                        <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                                            <Field
                                                f={f}
                                                value={form[f.key]}
                                                onChange={(v) => set(f.key, v)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {globalError && (
                                <div className="flex items-center gap-2 text-[13px] text-red-500 font-medium -mt-1">
                                    {globalError}
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-[14px] bg-gray-50">
                            <span className="text-[12px] text-gray-400">
                                <span className="text-red-400 mr-0.5">*</span>Required fields only to save
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-[7px] rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || saved}
                                    className={`px-5 py-[7px] rounded-xl text-[13px] font-medium flex items-center gap-1.5 transition-all disabled:opacity-75 ${saved ? "bg-green-600 text-white" : "bg-[#003366] text-white hover:bg-[#004488]"
                                        }`}
                                >
                                    {loading ? <Loader2 className="w-[13px] h-[13px] animate-spin" /> : <Check className="w-[13px] h-[13px]" />}
                                    {loading ? "Saving…" : saved ? "Saved!" : `Save ${title}`}
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}