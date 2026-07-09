// components/PartyFormModal.jsx
//
// One reusable "Add Party" modal used everywhere a Consignee / Notify Party /
// Contact Person needs to be created — Contract, Invoice, Proforma, etc.
//
// It only knows about the FORM — it does not know how to save the party. The
// parent page owns the actual API call (its RTK mutation hook) and passes it
// in as `onSubmit`, so each page keeps its own data-fetching logic while
// sharing one piece of UI.
//
// Usage — fixed type (e.g. "New" button on the Consignee card only creates a Consignee):
//   <PartyFormModal
//     partyType="consignee"
//     onClose={() => setModalType(null)}
//     onSubmit={(type, values) => handleCreateParty(type, values)}
//   />
//
// Usage — user picks the type inside the modal (e.g. a single generic "Add Party" button):
//   <PartyFormModal
//     showTypeSelector
//     initialType="consignee"
//     onClose={() => setModalSection(null)}
//     onSubmit={(type, values) =>
//       addCustomerParty({ type, customerId, data: values }).unwrap()
//     }
//     onSuccess={handlePartyAdded}
//   />

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, X, Mail, Phone, MapPin, Building2, Globe, Hash, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
// import CustomSelect from './CustomSelect';
import InputBox from './InputBox';
import CustomSelect from './CustomSelect';

const PARTY_TYPE_OPTIONS = [
  { id: 'consignee', name: 'Consignee' },
  { id: 'notifyParty', name: 'Notify Party' },
  { id: 'contactPerson', name: 'Contact Person' },
];

const PARTY_LABELS = {
  consignee: 'Consignee',
  notifyParty: 'Notify Party',
  contactPerson: 'Contact Person',
};

const EMPTY_PARTY = {
  name: '', email: '', phone: '', altPhone: '',
  address: '', city: '', state: '', country: '',
  pinCode: '', usciNo: '',
};

export default function PartyFormModal({
  partyType,
  initialType = 'consignee',
  showTypeSelector = false,
  typeOptions = PARTY_TYPE_OPTIONS,
  onClose,
  onSubmit,
  onSuccess,
}) {
  const [type, setType] = useState(partyType);
  const [form, setForm] = useState(EMPTY_PARTY);
  const [saving, setSaving] = useState(false);

  const label = PARTY_LABELS[type] || 'Party';
  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      setSaving(true);
      const newParty = await onSubmit(type, form);
      toast.success(`${label} added successfully`);
      onSuccess?.(newParty);
      onClose();
    } catch (err) {
      console.error('Save party error:', err);
      toast.error(err?.data?.message || err?.data?.error || err?.message || 'Failed to save party');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          // onClick={() => !saving && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ scale: 0.95, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 16, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#003366]">
                <UserCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">New {label}</h2>
                <p className="mt-0.5 text-xs text-gray-400">Fill in the details below</p>
              </div>
            </div>
            <button
              onClick={() => !saving && onClose()}
              disabled={saving}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
            {showTypeSelector && (
              <CustomSelect
                label="Party Type"
                placeholder="Select party type"
                options={typeOptions}
                value={type}
                onChange={setType}
              />
            )}

            <InputBox
              title="Name"
              inputFor="party-name"
              value={form.name}
              isMandatory
              handleChangeFunction={set('name')}
              placeholder="Full name"
            />

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                title="Email"
                inputFor="party-email"
                value={form.email}
                handleChangeFunction={set('email')}
                placeholder="email"
                icon={<Mail className="w-3.5 h-3.5" />}
              />
              <InputBox
                title="Phone"
                inputFor="party-phone"
                value={form.phone}
                handleChangeFunction={set('phone')}
                placeholder="-"
                icon={<Phone className="w-3.5 h-3.5" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                title="Alt. Phone"
                inputFor="party-altPhone"
                value={form.altPhone}
                handleChangeFunction={set('altPhone')}
                placeholder="Alternate number"
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              <InputBox
                title="USCI No."
                inputFor="party-usciNo"
                value={form.usciNo}
                handleChangeFunction={set('usciNo')}
                placeholder="USCI Number"
                icon={<Hash className="w-3.5 h-3.5" />}
              />
            </div>

            <InputBox
              title="Street Address"
              inputFor="party-address"
              value={form.address}
              handleChangeFunction={set('address')}
              placeholder="-"
              icon={<MapPin className="w-3.5 h-3.5" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                title="City"
                inputFor="party-city"
                value={form.city}
                handleChangeFunction={set('city')}
                placeholder="City"
                icon={<Building2 className="w-3.5 h-3.5" />}
              />
              <InputBox
                title="State"
                inputFor="party-state"
                value={form.state}
                handleChangeFunction={set('state')}
                placeholder="State / Province"
                icon={<Building2 className="w-3.5 h-3.5" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                title="Country"
                inputFor="party-country"
                value={form.country}
                handleChangeFunction={set('country')}
                placeholder="-"
                icon={<Globe className="w-3.5 h-3.5" />}
              />
              <InputBox
                type="number"
                title="Pin / Postal Code"
                inputFor="party-pinCode"
                value={form.pinCode}
                handleChangeFunction={set('pinCode')}
                placeholder="-"
                icon={<Hash className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
            <button
              onClick={() => !saving && onClose()}
              disabled={saving}
              className="rounded-xl border border-transparent px-5 py-2 text-sm font-semibold text-gray-500 transition-all hover:border-gray-200 hover:bg-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#003366] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-[#003366]/20 transition-all hover:bg-[#004080] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}