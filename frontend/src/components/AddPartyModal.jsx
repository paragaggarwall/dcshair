

import { useState } from 'react';
import { Plus, Mail, Phone, MapPin, Hash, Navigation, UserCircle2, User2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';
import PartyFormModal from './Partyadd';
import { Navigate, useNavigate } from 'react-router-dom';




function DetailPill({ icon, value }) {
    return (
        <div className="flex items-center gap-1.5 rounded-lg  px-2.5 space-y-1.5 text-[11px] leading-tight text-slate-600">
            <span className="flex-shrink-0 text-blue-400">{icon}</span>
            <span className="">{value}</span>
        </div>
    );
}

export function PartyInfoCard({ party, emptyLabel = 'party' }) {
    if (!party) {
        return (
            <div className="flex h-14 items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 text-xs italic text-gray-300">
                <UserCircle2 className="w-4 h-4" />
                <span>No {emptyLabel} selected</span>
            </div>
        );
    }

    const addressLine = [party.address, party.city, party.state, party.country]
        .filter(Boolean)
        .join(', ');

    return (
        <div className="space-y-1.5">
            {party.email && <DetailPill icon={<Mail className="w-3 h-3" />} value={party.email} />}
            {party.phone && (
                <DetailPill
                    icon={<Phone className="w-3 h-3" />}
                    value={party.altPhone ? `${party.phone} / ${party.altPhone}` : party.phone}
                />
            )}
            {addressLine && <DetailPill icon={<MapPin className="w-3 h-3" />} value={addressLine} />}
            {party.usciNo && <DetailPill icon={<Hash className="w-3 h-3" />} value={`USCIN: ${party.usciNo}`} />}
            {party.pinCode && <DetailPill icon={<Navigation className="w-3 h-3" />} value={`Postal Code: ${party.pinCode}`} />}
        </div>
    );
}

function PartySelector({
    label,
    fetchparty,
    partyType,
    icon = <UserCircle2 className="w-3.5 h-3.5" />,
    parties = [],
    value,
    onChange,
    onCreateParty,
    onPartyCreated,
    loading = false,
    disabled = false,
    searchable = false,
    readOnly = false,
    readOnlyParty = null,
}) {
    const [modalOpen, setModalOpen] = useState(false);

    const selected = readOnly ? readOnlyParty : parties.find((p) => p.id === value) || null;

    const handleSubmit = async (type, values) => {
        const newParty = await onCreateParty(type, values);
        // onChange?.(newParty.id);
        // onPartyCreated?.(newParty);
        return newParty;
    };

    return (
        <div
            className={` rounded-2xl border border-blue-100 bg-white transition-opacity ${disabled ? 'cursor-not-allowed bg-gray-100 opacity-80' : ''
                }`}
        >

            <div className="flex items-center justify-between border-b border-blue-100 bg-gray-50/60 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <div className="text-[#003366]">{icon}</div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{label}</span>
                </div>
                {!readOnly && (
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        disabled={disabled}
                        className="flex items-center gap-1 rounded-lg bg-[#003366] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm shadow-[#003366]/25 transition-colors hover:bg-[#004080] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="w-3 h-3" /> New
                    </button>
                )}
            </div>

            <div className="space-y-3 px-4 py-3 bg-blue-50/60">
                {!readOnly && (
                    <CustomSelect
                        placeholder={loading ? 'Loading…' : `Choose ${label.toLowerCase()}`}
                        options={parties.map((p) => ({ id: p.id, name: p.name }))}
                        value={value}
                        onChange={onChange}
                        searchable={searchable}
                    />
                )}

                <PartyInfoCard party={selected} emptyLabel={label.toLowerCase()} />
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <PartyFormModal
                        partyType={partyType}
                        onClose={() => setModalOpen(false)}
                        onSubmit={handleSubmit}
                        showTypeSelector={true}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}











const PARTY_TYPES = {
    consignee: {
        label: "Consignee",
        partyKey: "consignees",
        formKey: "consigneeId",
    },
    notifyParty: {
        label: "Notify Party",
        partyKey: "notifyParties",
        formKey: "notifyPartyId",
    },
    contactPerson: {
        label: "Contact Person",
        partyKey: "contactPersons",
        formKey: "contactPersonId",
    },
};

export default function PartySection({
    customer,
    parties,
    values,
    disabled,
    onChange,
    onCreateParty,
    onPartyCreated,
}) {

    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Details */}
            {customer && (
                <div className='col-span-full'>
                    <div className='rounded-2xl border border-blue-100 bg-white transition-opacity'>
                        <div className="flex items-center justify-between border-b border-blue-100 bg-gray-50/60 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <div className="text-[#003366]"><UserCircle2 className="w-3.5 h-3.5" /></div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Customer</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/customers/add")}
                                className="flex items-center gap-1 rounded-lg bg-[#003366] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm shadow-[#003366]/25 transition-colors hover:bg-[#004080] cursor-pointer "
                            >
                                <Plus className="w-3 h-3" /> New
                            </button>
                        </div>

                        {< div className="p-3 bg-blue-50/60 border border-blue-100 rounded-b-xl space-y-1.5">
                            <p className="text-sm font-semibold text-slate-800">{customer?.name}</p>
                            {[customer?.address, customer?.city, customer?.state, customer?.country, customer?.pinCode].filter(Boolean).length > 0 && (
                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                    <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span>{[customer?.address, customer?.city, customer?.state, customer?.country, customer?.pinCode].filter(Boolean).join(", ")}</span>
                                </div>
                            )}
                            {customer?.phone && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                    <span>{customer?.phone}{customer?.altPhone ? ` / ${customer?.altPhone}` : ""}</span>
                                </div>
                            )}
                            {customer?.email && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                    <span>{customer?.email}</span>
                                </div>
                            )}
                            {customer?.usciNo && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Hash className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                    <span>{`USCI:${customer?.usciNo}`}</span>
                                </div>
                            )}
                            {customer?.pinCode && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Navigation className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                    <span>{`PostalCode:${customer?.pinCode}`}</span>
                                </div>
                            )}
                        </div>}
                    </div>

                </div>
            )}

            {Object.entries(PARTY_TYPES).map(([type, cfg]) => (
                <PartySelector
                    key={type}
                    label={cfg.label}
                    partyType={type}
                    parties={parties[cfg.partyKey] || []}
                    value={values[cfg.formKey]}
                    disabled={disabled}
                    onChange={(id) => onChange(cfg.formKey, id)}
                    onCreateParty={onCreateParty}
                    onPartyCreated={(party) =>
                        onPartyCreated(cfg.partyKey, party)
                    }
                />
            ))}
        </div>
    );
}


