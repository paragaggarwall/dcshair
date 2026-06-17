

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import {
    ArrowLeft, Loader2, Save, Home,
    ChevronDown, Users, Bell, Phone as PhoneIcon, Building2,
    Edit, User, Plus, Trash2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import toast from 'react-hot-toast';

const allCountries = [
    'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Thailand', 'Vietnam', 'Malaysia',
    'Singapore', 'Indonesia', 'Philippines', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
    'Bhutan', 'Afghanistan', 'Iran', 'Iraq', 'Saudi Arabia', 'United Arab Emirates', 'Qatar',
    'Kuwait', 'Oman', 'Yemen', 'Israel', 'Jordan', 'Turkey', 'Kazakhstan', 'Uzbekistan',
    'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'United Kingdom', 'France', 'Germany',
    'Italy', 'Spain', 'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Greece', 'Ireland',
    'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Ukraine', 'Russia', 'South Africa', 'Egypt',
    'Nigeria', 'Kenya', 'Ethiopia', 'Morocco', 'Ghana', 'Algeria', 'Tunisia', 'Uganda',
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia',
    'Venezuela', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'
];

const emptyParty = {
    name: '', email: '', phone: '', altPhone: '',
    address: '', city: '', state: '', usciNo: '', pinCode: '', country: 'India'
};

const SECTION_TO_API_TYPE = {
    consignees: 'consignee',
    notifyParties: 'notifyParty',
    contactPersons: 'contactPerson',
};

const SECTION_LABELS = {
    consignees: 'Consignee',
    notifyParties: 'Notify Party',
    contactPersons: 'Contact Person',
};

function AddPartyModal({ sectionKey, customerId, onClose, onAdded }) {
    const [form, setForm] = useState({ ...emptyParty });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const label = SECTION_LABELS[sectionKey];
    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSave = async () => {
        const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pinCode', 'usciNo'];
        for (const f of required) {
            if (!form[f]?.trim()) {
                setError(`${f === 'usciNo' ? 'USCI No.' : f.charAt(0).toUpperCase() + f.slice(1)} is required`);
                return;
            }
        }
        if (String(form.pinCode).length !== 6) {
            setError('Postal Code must be exactly 6 digits');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const res = await api.post('/contracts/party', {
                type: SECTION_TO_API_TYPE[sectionKey],
                customerId,
                data: form,
            });
            onAdded(res.data);
            toast.success(`${label} added successfully`);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
            <motion.div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                initial={{ scale: 0.95, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 16, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Add New {label}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Fill in the details and save</p>
                    </div>
                    <button type="button" onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {error && (
                        <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputBox title="Full Name" isMandatory inputFor="m-name" value={form.name} placeholder="e.g. Acme Corp" handleChangeFunction={set('name')} />
                        <InputBox title="Email Address" isMandatory inputFor="m-email" value={form.email} placeholder="contact@company.com" handleChangeFunction={set('email')} />
                        <InputBox title="Primary Phone" isMandatory inputFor="m-phone" value={form.phone} placeholder="+1 234 567 8900" handleChangeFunction={set('phone')} />
                        <InputBox title="Alternate Phone" inputFor="m-altPhone" value={form.altPhone} placeholder="Optional" handleChangeFunction={set('altPhone')} />
                    </div>
                    <div className="border-t border-dashed border-gray-100 pt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Home className="w-3 h-3" /> Address
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <InputBox title="Street Address" isMandatory inputFor="m-address" value={form.address} placeholder="Apartment, Street, Area" handleChangeFunction={set('address')} />
                            </div>
                            <InputBox title="City" isMandatory inputFor="m-city" value={form.city} placeholder="e.g. Mumbai" handleChangeFunction={set('city')} />
                            <InputBox title="State / Province" isMandatory inputFor="m-state" value={form.state} placeholder="e.g. Maharashtra" handleChangeFunction={set('state')} />
                            <InputBox title="Postal Code" isMandatory inputFor="m-pinCode" value={form.pinCode} placeholder="e.g. 122506" type="number"
                                handleChangeFunction={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 6) setForm(p => ({ ...p, pinCode: val }));
                                }}
                            />
                            <InputBox title="USCI No." isMandatory inputFor="m-usciNo" value={form.usciNo} placeholder="e.g. 658565423534658" handleChangeFunction={set('usciNo')} />
                            <div className="md:col-span-2">
                                <CustomSelect
                                    label="Country"
                                    options={allCountries.map(c => ({ id: c, name: c }))}
                                    value={form.country}
                                    onChange={val => setForm(p => ({ ...p, country: val }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/60 border-t border-gray-100">
                    <button type="button" onClick={onClose}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={saving}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#003366] hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-60 cursor-pointer">
                        {saving
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                            : <><Plus className="w-3.5 h-3.5" /> Add {label}</>
                        }
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function PartyFields({ data, onChange, prefix }) {
    return (
        <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox title="Full Name" isMandatory inputFor={`${prefix}-name`} value={data.name} placeholder="e.g. Acme Corp" handleChangeFunction={e => onChange('name', e.target.value)} />
                <InputBox title="Email Address" isMandatory inputFor={`${prefix}-email`} value={data.email} placeholder="contact@company.com" handleChangeFunction={e => onChange('email', e.target.value)} />
                <InputBox title="Primary Phone" isMandatory inputFor={`${prefix}-phone`} value={data.phone} placeholder="+1 234 567 8900" handleChangeFunction={e => onChange('phone', e.target.value)} />
                <InputBox title="Alternate Phone" inputFor={`${prefix}-altPhone`} value={data.altPhone} placeholder="Optional" handleChangeFunction={e => onChange('altPhone', e.target.value)} />
            </div>
            <div className="border-t border-dashed border-gray-100 pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Home className="w-3 h-3" /> Address
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <InputBox title="Street Address" isMandatory inputFor={`${prefix}-address`} value={data.address} placeholder="Apartment, Street, Area" handleChangeFunction={e => onChange('address', e.target.value)} />
                    </div>
                    <InputBox title="City" isMandatory inputFor={`${prefix}-city`} value={data.city} placeholder="e.g. Mumbai" handleChangeFunction={e => onChange('city', e.target.value)} />
                    <InputBox title="State / Province" isMandatory inputFor={`${prefix}-state`} value={data.state} placeholder="e.g. Maharashtra" handleChangeFunction={e => onChange('state', e.target.value)} />
                    <InputBox title="Postal Code" isMandatory inputFor={`${prefix}-pinCode`} value={data.pinCode} placeholder="e.g. 122506" type="number"
                        handleChangeFunction={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 6) onChange('pinCode', val);
                        }}
                    />
                    <InputBox title="USCI No." isMandatory inputFor={`${prefix}-usciNo`} value={data.usciNo} placeholder="e.g. 658565423534658" handleChangeFunction={e => onChange('usciNo', e.target.value)} />
                    <div className="md:col-span-2">
                        <CustomSelect
                            label="Country"
                            options={allCountries.map(c => ({ id: c, name: c }))}
                            value={data.country}
                            onChange={val => onChange('country', val)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccordionSection({
    icon: Icon, title, color, isOpen, onToggle,
    entries, selectedIndex, onSelectIndex, onOpenAddModal, onDeleteEntry,
    onFieldChange, sectionKey
}) {
    const selectedEntry = entries[selectedIndex] ?? entries[0];

    const dropdownOptions = entries.map((e, i) => ({
        id: String(i),
        name: e.name?.trim() ? e.name : `Entry ${i + 1}`
    }));

    return (
        <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${isOpen ? 'border-[#003366]/20' : 'border-gray-100 hover:border-gray-200'}`}>

            {/* Header */}
            <div className="w-full flex items-center justify-between px-6 py-4">
                <button type="button" onClick={onToggle}
                    className="flex items-center gap-3 text-left flex-1 cursor-pointer">
                    <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                        </p>
                    </div>
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-100">
                        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <button type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenAddModal(); }}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#003366] hover:bg-[#004080]  px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-[#003366]/20 cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                    <button type="button" onClick={onToggle}
                        className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1400px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 pb-6 border-t border-gray-50 space-y-4">
                    {entries.length > 0 && (
                        <div className="flex items-end gap-2 pt-1">
                            <div className="flex-1">
                                <CustomSelect
                                    label={`Select ${SECTION_LABELS[sectionKey]} to Edit`}
                                    options={dropdownOptions}
                                    value={String(selectedIndex)}
                                    onChange={val => onSelectIndex(Number(val))}
                                />
                            </div>
                            {entries.length > 0 && (
                                <button type="button" onClick={() => onDeleteEntry(selectedIndex)}
                                    className="mb-0.5 flex items-center  text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap">
                                    <Trash2 className="w-3.5 h-5" />
                                </button>
                            )}
                        </div>
                    )}
                    {selectedEntry && (
                        <PartyFields
                            prefix={`${sectionKey}-${selectedIndex}`}
                            data={selectedEntry}
                            onChange={(field, val) => onFieldChange(selectedIndex, field, val)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

const partySections = [
    { key: 'consignees', title: 'Consignee Details', icon: Users, color: 'bg-purple-50 text-purple-600' },
    { key: 'notifyParties', title: 'Notify Party Details', icon: Bell, color: 'bg-amber-50 text-amber-600' },
    { key: 'contactPersons', title: 'Contact Person Details', icon: PhoneIcon, color: 'bg-green-50 text-green-600' },
];

export default function EditCustomer() {
    const navigate = useNavigate();
    const { id } = useParams();
    const customerId = Number(id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    // null = modal closed  |  'consignees' / 'notifyParties' / 'contactPersons' = modal open
    const [modalSection, setModalSection] = useState(null);

    const [selectedIndexes, setSelectedIndexes] = useState({
        consignees: 0, notifyParties: 0, contactPersons: 0,
    });

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', altPhone: '',
        address: '', city: '', state: '', usciNo: '', pinCode: '', country: 'India',
        consignees: [{ ...emptyParty }],
        buyers: [{ ...emptyParty }],
        notifyParties: [{ ...emptyParty }],
        contactPersons: [{ ...emptyParty }],
    });

    const toggle = (key) => setOpenSection(prev => prev === key ? null : key);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await api.get(`/customers/${id}`);
                setFormData({
                    ...res.data,
                    consignees: res.data.consignees?.length ? res.data.consignees : [{ ...emptyParty }],
                    buyers: res.data.buyers?.length ? res.data.buyers : [{ ...emptyParty }],
                    notifyParties: res.data.notifyParties?.length ? res.data.notifyParties : [{ ...emptyParty }],
                    contactPersons: res.data.contactPersons?.length ? res.data.contactPersons : [{ ...emptyParty }],
                });
            } catch {
                toast.error("Failed to fetch customer");
            }
        };
        if (id) fetchCustomer();
    }, [id]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePartyFieldChange = (partyType, entryIndex, field, value) => {
        setFormData(prev => {
            const updated = [...prev[partyType]];
            updated[entryIndex] = { ...updated[entryIndex], [field]: value };
            return { ...prev, [partyType]: updated };
        });
    };

    // Called when modal POSTs successfully — appends new party & selects it
    const handlePartyAdded = (sectionKey, newParty) => {
        setFormData(prev => {
            const updated = [...prev[sectionKey], newParty];
            // select the newly added entry
            setSelectedIndexes(si => ({ ...si, [sectionKey]: updated.length - 1 }));
            return { ...prev, [sectionKey]: updated };
        });
        setOpenSection(sectionKey); // open the accordion so the user sees it
    };

    const handleDeleteEntry = async (partyType, entryIndex) => {
        const party = formData[partyType][entryIndex];

        console.log("Deleting party:", party); // should show id

        if (!party?.id) {
            toast.error("Party ID not found");
            return;
        }

        try {
            await api.post('/contracts/party/delete', {
                type: SECTION_TO_API_TYPE[partyType],
                customerId,
                partyid: party.id
            });

            setFormData(prev => {
                const updated = prev[partyType].filter((_, i) => i !== entryIndex);

                return {
                    ...prev,
                    [partyType]: updated.length ? updated : [{ ...emptyParty }]
                };
            });

            setSelectedIndexes(prev => ({
                ...prev,
                [partyType]: Math.max(0, entryIndex - 1)
            }));

            toast.success("Deleted successfully");

        } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.error || "Delete failed");
        }
    };
    // ── Validation ────────────────────────────────────────────────────────────

    const validateForm = () => {
        const required = [
            { key: 'name', label: 'Buyer Name' },
            { key: 'email', label: 'Email Address' },
            { key: 'address', label: 'Street Address' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State / Province' },
            { key: 'pinCode', label: 'Postal Code' },
            { key: 'usciNo', label: 'USCI No.' },
        ];
        for (const f of required) {
            if (!formData[f.key]?.trim()) { toast.error(`${f.label} is required`); return false; }
        }
        if (String(formData.pinCode).length !== 6) {
            toast.error('Postal Code must be exactly 6 digits'); return false;
        }
        const validateParty = (party, name) => {
            if (!party.name?.trim()) return true;
            for (const f of ['email', 'phone', 'address', 'city', 'state', 'pinCode', 'usciNo']) {
                if (!party[f]?.trim()) { toast.error(`${name}: ${f} is required`); return false; }
            }
            if (String(party.pinCode).length !== 6) {
                toast.error(`${name}: Postal Code must be 6 digits`); return false;
            }
            return true;
        };
        for (const c of formData.consignees) { if (!validateParty(c, 'Consignee')) return false; }
        for (const n of formData.notifyParties) { if (!validateParty(n, 'Notify Party')) return false; }
        for (const cp of formData.contactPersons) { if (!validateParty(cp, 'Contact Person')) return false; }
        return true;
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const payload = {
                consignees: formData.consignees.filter(c => c.name?.trim()),
                notifyParties: formData.notifyParties.filter(n => n.name?.trim()),
                contactPersons: formData.contactPersons.filter(cp => cp.name?.trim()),
            };
            await api.post(`/customers/update/${id}`, payload);
            toast.success("Customer updated successfully");
            navigate('/customers');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update customer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

            {/* Top nav */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
                <div className="mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <button onClick={() => navigate('/customers')}
                            className="p-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-gray-600 cursor-pointer">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 leading-tight">Edit Customer</h1>
                                <p className="text-xs text-gray-500">Update client details and save changes</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
                        <Edit className="w-4 h-4" /> Editing Mode
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="mx-auto space-y-4 p-6 pb-20">

                    {/* Buyer Details (read-only) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#003366]"><Building2 className="w-4 h-4" /></div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900">Buyer Details</h2>
                                <p className="text-xs text-gray-400">Primary customer information</p>
                            </div>
                            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-100">Required</span>
                        </div>
                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputBox title="Buyer Name" isMandatory inputFor="name" value={formData.name} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <InputBox title="Email Address" isMandatory inputFor="email" value={formData.email} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <InputBox title="Primary Phone" inputFor="phone" value={formData.phone} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <InputBox title="Alternate Phone" inputFor="altPhone" value={formData.altPhone} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <div className="md:col-span-2">
                                    <InputBox title="Street Address" isMandatory inputFor="address" value={formData.address} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                </div>
                                <InputBox title="City" isMandatory inputFor="city" value={formData.city} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <InputBox title="State / Province" isMandatory inputFor="state" value={formData.state} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <InputBox title="Postal Code" isMandatory inputFor="pinCode" value={formData.pinCode} placeholder="-" type="number"
                                    handleChangeFunction={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 6) setFormData(p => ({ ...p, pinCode: val }));
                                    }} isInputBoxDisabled />
                                <InputBox title="USCI No." isMandatory inputFor="usciNo" value={formData.usciNo} placeholder="-" handleChangeFunction={handleInputChange} isInputBoxDisabled />
                                <div className="md:col-span-2">
                                    <CustomSelect label="Country" options={allCountries.map(c => ({ id: c, name: c }))} value={formData.country} onChange={val => setFormData(p => ({ ...p, country: val }))} isDisabled />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accordion sections */}
                    {partySections.map(section => (
                        <AccordionSection
                            key={section.key}
                            sectionKey={section.key}
                            icon={section.icon}
                            title={section.title}
                            color={section.color}
                            isOpen={openSection === section.key}
                            onToggle={() => toggle(section.key)}
                            entries={formData[section.key]}
                            selectedIndex={selectedIndexes[section.key]}
                            onSelectIndex={idx => setSelectedIndexes(prev => ({ ...prev, [section.key]: idx }))}
                            onOpenAddModal={() => setModalSection(section.key)}
                            onDeleteEntry={idx => handleDeleteEntry(section.key, idx)}
                            onFieldChange={(idx, field, val) => handlePartyFieldChange(section.key, idx, field, val)}
                        />
                    ))}

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => navigate('/customers')}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
                            Cancel
                        </button>
                        <button disabled={isSubmitting} type="submit"
                            className="bg-[#003366] text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-70 cursor-pointer">
                            {isSubmitting
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : <><Save className="w-4 h-4" /> Update Customer</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Add Party Modal */}
            <AnimatePresence>
                {modalSection && (
                    <AddPartyModal
                        key={modalSection}
                        sectionKey={modalSection}
                        customerId={customerId}
                        onClose={() => setModalSection(null)}
                        onAdded={(newParty) => handlePartyAdded(modalSection, newParty)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}