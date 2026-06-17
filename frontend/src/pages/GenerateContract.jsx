// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import {
//   FileText, ArrowLeft, Loader2, Save, Info, Truck, CreditCard, Package, Trash2, Users, UserCheck
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import CustomSelect from '../components/CustomSelect';

// export default function GenerateContract() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [options, setOptions] = useState({ customers: [], products: [], termsOfPayment: [] });
//   const [parties, setParties] = useState({ consignees: [], buyers: [], notifyParties: [], contactPersons: [] });
//   const [partiesLoading, setPartiesLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     customerId: '',
//     consigneeId: '',
//     buyerId: '',
//     notifyPartyId: '',
//     contactPersonId: '',
//     termsOfPaymentId: '',
//     items: [],
//     countryOfOrigin: 'INDIA',
//     countryOfDestination: '',
//     description: '',
//     packing: '',
//     insurance: '',
//     preCarriageBy: 'Sea',
//     portOfLoading: '',
//     portOfFinalDestination: '',
//     operatingAirlines: '',
//     speacialCondition: '',
//     note: '',
//     expectedDepartureDate: '',
//     expectedDeliveryDate: ''
//   });

//   useEffect(() => {
//     api.get('/contracts/options')
//       .then(res => setOptions(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // When customer changes, load their parties
//   useEffect(() => {
//     if (!formData.customerId) {
//       setParties({ consignees: [], buyers: [], notifyParties: [], contactPersons: [] });
//       setFormData(p => ({ ...p, consigneeId: '', buyerId: '', notifyPartyId: '', contactPersonId: '' }));
//       return;
//     }
//     setPartiesLoading(true);
//     api.get(`/contracts/customer/${formData.customerId}/parties`)
//       .then(res => setParties(res.data))
//       .catch(console.error)
//       .finally(() => setPartiesLoading(false));
//   }, [formData.customerId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Inline party creation — posts to /party and updates local list
//   const makePartyCreator = (type, partyKey) => async (data) => {
//     const res = await api.post('/contracts/party', { type, customerId: formData.customerId, data });
//     const newParty = res.data;
//     setParties(prev => ({ ...prev, [partyKey]: [...prev[partyKey], newParty] }));
//     return newParty;
//   };

//   const handleProductSelect = (productId) => {
//     const product = options.products.find(p => p.id === productId);
//     if (!product || formData.items.some(item => item.productId === productId)) return;
//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, { productId, name: product.name, skuCode: product.skuCode, quantity: 0, pricePerKg: 0 }]
//     }));
//   };

//   const handleRemoveItem = (productId) => {
//     setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.productId !== productId) }));
//   };

//   const handleItemChange = (productId, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       items: prev.items.map(item => item.productId === productId ? { ...item, [field]: value } : item)
//     }));
//   };

//   const handleCreateTermsOfPayment = async (name) => {
//     const res = await api.post('/contracts/terms-of-payment', { name });
//     const newTerm = res.data;
//     setOptions(prev => ({ ...prev, termsOfPayment: [...prev.termsOfPayment, newTerm] }));
//     return newTerm;
//   };

//   const totalWeight = formData.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
//   const totalPrice = formData.items.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerKg) || 0)), 0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.items.length === 0) { setError('Please add at least one product'); return; }
//     setSubmitting(true);
//     setError('');
//     try {
//       await api.post('/contracts/create', formData);
//       navigate('/contracts');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to generate contract');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[400px] flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
//       </div>
//     );
//   }

//   const customerSelected = !!formData.customerId;

//   const handleToggleAllProducts = () => {
//     const allSelected =
//       options.products.length > 0 &&
//       options.products.every(product =>
//         formData.items.some(item => item.productId === product.id)
//       );

//     if (allSelected) {
//       setFormData(prev => ({
//         ...prev,
//         items: []
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         items: options.products.map(product => ({
//           productId: product.id,
//           name: product.name,
//           skuCode: product.skuCode,
//           quantity: 0,
//           pricePerKg: 0
//         }))
//       }));
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-20">
//       <div className="flex items-center gap-4">
//         <button onClick={() => navigate('/contracts')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Generate New Contract</h1>
//           <p className="text-sm text-gray-500 mt-1">Fill in the details to create a formal export contract</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">{error}</div>
//         )}

//         {/* ── Basic Information ─────────────────────────────── */}
//         <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
//           <SectionHeader icon={<Info className="w-5 h-5" />} title="Basic Information" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 ml-1">Contract Name / Reference *</label>
//               <input required name="name" value={formData.name} onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm bg-gray-50/50"
//                 placeholder="e.g. DCS-Q2-2026" />
//             </div>
//             <CustomSelect label="Buyer Customer" required options={options.customers} value={formData.customerId}
//               onChange={(val) => setFormData(p => ({ ...p, customerId: val }))} placeholder="Select Customer" />
//           </div>
//         </section>

//         {/* ── Parties (Consignee, Notify, Contact) ──── */}
//         <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
//           <SectionHeader icon={<Users className="w-5 h-5" />} title="Parties" subtitle={!customerSelected ? 'Select a customer first to load parties' : ''} />

//           {partiesLoading ? (
//             <div className="flex items-center gap-2 text-sm text-gray-400">
//               <Loader2 className="w-4 h-4 animate-spin" /> Loading parties...
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <CustomSelect label="Consignee" options={parties.consignees}
//                 value={formData.consigneeId} onChange={(val) => setFormData(p => ({ ...p, consigneeId: val }))}
//                 placeholder={customerSelected ? 'Select Consignee' : 'Select a customer first'}
//                 onCreate={customerSelected ? makePartyCreator('consignee', 'consignees') : undefined}
//                 createLabel="Create new consignee" />

//               <CustomSelect label="Notify Party" options={parties.notifyParties}
//                 value={formData.notifyPartyId} onChange={(val) => setFormData(p => ({ ...p, notifyPartyId: val }))}
//                 placeholder={customerSelected ? 'Select Notify Party' : 'Select a customer first'}
//                 onCreate={customerSelected ? makePartyCreator('notifyParty', 'notifyParties') : undefined}
//                 createLabel="Create new notify party" />

//               <CustomSelect label="Contact Person" options={parties.contactPersons}
//                 value={formData.contactPersonId} onChange={(val) => setFormData(p => ({ ...p, contactPersonId: val }))}
//                 placeholder={customerSelected ? 'Select Contact Person' : 'Select a customer first'}
//                 onCreate={customerSelected ? makePartyCreator('contactPerson', 'contactPersons') : undefined}
//                 createLabel="Create new contact person" />
//             </div>
//           )}
//         </section>

//         {/* ── Logistics ─────────────────────────────────────── */}
//         <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
//           <SectionHeader icon={<Truck className="w-5 h-5" />} title="Logistics & Shipping" />
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Field label="Country of Origin" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} />
//             <Field label="Country of Destination *" name="countryOfDestination" value={formData.countryOfDestination} onChange={handleChange} required placeholder="e.g. China" />
//             <CustomSelect label="Pre-Carriage By" options={[{ id: 'Sea', name: 'Sea' }, { id: 'Air', name: 'Air' }, { id: 'Road', name: 'Road' }]}
//               value={formData.preCarriageBy} onChange={(val) => setFormData(p => ({ ...p, preCarriageBy: val }))} searchable={false} />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Field label="Port of Loading" name="portOfLoading" value={formData.portOfLoading} onChange={handleChange} placeholder="e.g. Mundra Port" />
//             <Field label="Port of Final Destination" name="portOfFinalDestination" value={formData.portOfFinalDestination} onChange={handleChange} placeholder="e.g. New York Port" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Field label="Exp. Departure Date" name="expectedDepartureDate" type="date" value={formData.expectedDepartureDate} onChange={handleChange} />
//             <Field label="Exp. Delivery Date" name="expectedDeliveryDate" type="date" value={formData.expectedDeliveryDate} onChange={handleChange} />
//           </div>
//         </section>

//         {/* ── Products ──────────────────────────────────────── */}
//         <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
//           <SectionHeader icon={<Package className="w-5 h-5" />} title="Product Details" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
//             {/* <CustomSelect label="Add Product" options={options.products} value=""
//               onChange={handleProductSelect} placeholder="Search and add product..." /> */}

//             <CustomSelect
//               label="Add Product"
//               options={options.products}
//               value=""
//               onChange={handleProductSelect}
//               placeholder="Search and add product..."
//               toggleAll={{
//                 label:
//                   options.products.length > 0 &&
//                     options.products.every(product =>
//                       formData.items.some(item => item.productId === product.id)
//                     )
//                     ? "Unselect All Products"
//                     : "Select All Products",
//                 onClick: handleToggleAllProducts
//               }}
//             />
//             <CustomSelect label="Terms of Payment *" required options={options.termsOfPayment}
//               value={formData.termsOfPaymentId} onChange={(val) => setFormData(p => ({ ...p, termsOfPaymentId: val }))}
//               placeholder="Select Payment Terms"
//               onCreate={handleCreateTermsOfPayment} createLabel="Create new payment term" />
//           </div>

//           <div className="overflow-hidden border border-gray-100 rounded-xl">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
//                   <th className="px-6 py-4">Product</th>
//                   <th className="px-6 py-4">SKU</th>
//                   <th className="px-6 py-4 w-32">Qty (KG)</th>
//                   <th className="px-6 py-4 w-32">Price/KG</th>
//                   <th className="px-6 py-4 w-32 text-right">Total</th>
//                   <th className="px-6 py-4 w-16" />
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {formData.items.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-10 text-center text-gray-400 text-sm font-medium italic">
//                       No products added yet.
//                     </td>
//                   </tr>
//                 ) : formData.items.map((item) => (
//                   <tr key={item.productId}>
//                     <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
//                     <td className="px-6 py-4 text-xs text-gray-500 uppercase">{item.skuCode}</td>
//                     <td className="px-6 py-4">
//                       <input type="number" step="0.01" value={item.quantity}
//                         onChange={(e) => handleItemChange(item.productId, 'quantity', e.target.value)}
//                         className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:border-[#003366]/30 focus:outline-none text-sm font-medium" />
//                     </td>
//                     <td className="px-6 py-4">
//                       <input type="number" step="0.01" value={item.pricePerKg}
//                         onChange={(e) => handleItemChange(item.productId, 'pricePerKg', e.target.value)}
//                         className="w-full px-3 py-2 rounded-lg border border-gray-100 focus:border-[#003366]/30 focus:outline-none text-sm font-medium" />
//                     </td>
//                     <td className="px-6 py-4 text-right text-sm font-bold text-[#003366]">
//                       ${((parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerKg) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button type="button" onClick={() => handleRemoveItem(item.productId)}
//                         className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               {formData.items.length > 0 && (
//                 <tfoot className="bg-gray-50/50 border-t border-gray-100">
//                   <tr className="text-sm font-bold text-gray-900">
//                     <td colSpan="2" className="px-6 py-4 text-right">Summary:</td>
//                     <td className="px-6 py-4 text-[#003366]">{totalWeight.toFixed(2)} KG</td>
//                     <td className="px-6 py-4" />
//                     <td className="px-6 py-4 text-right text-lg text-[#003366]">
//                       ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td />
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>
//         </section>

//         {/* ── Additional Details ────────────────────────────── */}
//         <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
//           <SectionHeader icon={<FileText className="w-5 h-5" />} title="Additional Details" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Field label="Packing Instructions" name="packing" value={formData.packing} onChange={handleChange} placeholder="e.g. Export Worthy Packing" />
//             <Field label="Insurance Details" name="insurance" value={formData.insurance} onChange={handleChange} placeholder="e.g. Covered by Seller" />
//             <Field label="Operating Airlines" name="operatingAirlines" value={formData.operatingAirlines} onChange={handleChange} placeholder="e.g. Emirates" />
//           </div>
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 ml-1">Special Conditions</label>
//             <textarea name="speacialCondition" value={formData.speacialCondition} onChange={handleChange} rows={3}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm bg-gray-50/50 resize-none" />
//           </div>
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 ml-1">Please Note</label>
//             <textarea name="note" value={formData.note} onChange={handleChange} rows={2}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm bg-gray-50/50 resize-none" />
//           </div>
//         </section>

//         <div className="flex justify-end gap-4">
//           <button type="button" onClick={() => navigate('/contracts')}
//             className="px-8 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-100">
//             Cancel
//           </button>
//           <button disabled={submitting} type="submit"
//             className="bg-[#003366] text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-xl shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-70">
//             {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Save className="w-4 h-4" /> Generate Contract</>}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// // ─── Small reusable sub-components ─────────────────────────────────────────
// function SectionHeader({ icon, title, subtitle }) {
//   return (
//     <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
//       <div className="p-2 bg-blue-50 rounded-lg text-[#003366]">{icon}</div>
//       <div>
//         <h2 className="text-lg font-bold text-gray-900">{title}</h2>
//         {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
//       </div>
//     </div>
//   );
// }

// function Field({ label, name, value, onChange, placeholder, type = 'text', required }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
//       <input required={required} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
//         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] transition-all text-sm bg-gray-50/50" />
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FileText, ArrowLeft, Loader2, Save, Info, Truck, Package, Trash2, Users,
  Mail, Phone, MapPin, Hash, Plus, ChevronDown, UserCircle2,
  X, Building2, Globe, Navigation, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import toast from 'react-hot-toast';

const PARTY_CONFIG = {
  consignee: {
    label: 'Consignee',
    partyKey: 'consignees',
    formKey: 'consigneeId',
    border: 'border-blue-100',
    headerBg: 'bg-blue-500',
    icon: <UserCircle2 className="w-3.5 h-3.5" />,

  },
  notifyParty: {
    label: 'Notify Party',
    partyKey: 'notifyParties',
    formKey: 'notifyPartyId',
    border: 'border-blue-100',
    headerBg: 'bg-blue-500',
    icon: <UserCircle2 className="w-3.5 h-3.5" />,

  },
  contactPerson: {
    label: 'Contact Person',
    partyKey: 'contactPersons',
    formKey: 'contactPersonId',
    border: 'border-blue-100',
    headerBg: 'bg-blue-500',
    icon: <UserCircle2 className="w-3.5 h-3.5" />,

  },
};

const EMPTY_PARTY = {
  name: '', email: '', phone: '', altPhone: '',
  address: '', city: '', state: '', country: '',
  pinCode: '', usciNo: '',
};

function PartyFormModal({ type, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_PARTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const meta = PARTY_CONFIG[type];

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save');
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
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="text-[#003366]">
                {meta.icon}
              </div>              <div>
                <h2 className="text-base font-bold text-gray-900">New {meta.label}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {error && (
              <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
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
                placeholder="email@example.com"
                icon={<Mail className="w-3.5 h-3.5" />}
              />
              <InputBox
                title="Phone"
                inputFor="party-phone"
                value={form.phone}
                handleChangeFunction={set('phone')}
                placeholder="+91 00000 00000"
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
                title="USCIN No."
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
              placeholder="123 Main St, Suite 4"
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
                placeholder="Country"
                icon={<Globe className="w-3.5 h-3.5" />}
              />
              <InputBox
                type='number'
                title="Pin / Postal Code"
                inputFor="party-pinCode"
                value={form.pinCode}
                handleChangeFunction={set('pinCode')}
                placeholder="000000"
                icon={<Hash className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/60 border-t border-gray-100">
            <button onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white hover:border-gray-200 border border-transparent transition-all">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#003366] hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-60">
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : 'Save'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailPill({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 leading-tight">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function PartyDetailCard({ type, config, list, selectedId, selected, disabled, onSelect, onCreate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border ${config.border} overflow-hidden transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className={`border-b ${config.border} px-4 py-2.5 flex items-center justify-between bg-gray-50/60`}>
        <div className="flex items-center gap-2">
          <div className="text-[#003366]">
            {config.icon}
          </div>          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{config.label}</span>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-1 border p-1 rounded-xl bg-[#003366] text-[10px] font-bold text-white shadow-[#003366]/25 hover:bg-[#004080] transition-colors"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      <div className="bg-white px-4 py-3 space-y-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all"
          >
            <span className="truncate">{selected ? selected.name : <span className="text-gray-400 font-normal">Select…</span>}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1"
              >
                {list.length === 0 ? (
                  <li className="px-4 py-3 text-xs text-gray-400 italic text-center">No {config.label.toLowerCase()}s found</li>
                ) : list.map(p => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => { onSelect(p.id); setOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${selectedId === p.id ? 'font-bold text-[#003366]' : 'text-gray-700'}`}
                    >
                      {selectedId === p.id && (
                        <span className="text-[#003366] flex-shrink-0">
                          {config.icon}
                        </span>
                      )}                      {p.name}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {selected ? (
          <div className="space-y-1.5">
            {selected.email && <DetailPill icon={<Mail className="w-3 h-3" />} value={selected.email} />}
            {selected.phone && <DetailPill icon={<Phone className="w-3 h-3" />} value={selected.phone} />}
            {(selected.city || selected.country) && (
              <DetailPill
                icon={<MapPin className="w-3 h-3" />}
                value={[selected.address, selected.city, selected.state, selected.country].filter(Boolean).join(', ')}
              />
            )}
            {selected.usciNo && <DetailPill icon={<Hash className="w-3 h-3" />} value={`USCIN: ${selected.usciNo}`} />}
            {selected.pinCode && <DetailPill icon={<Navigation className="w-3 h-3" />} value={`PostalCode: ${selected.pinCode}`} />}
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
            <UserCircle2 className="w-4 h-4" />
            <span>No party selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AccordionSection({ icon, title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 ">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-[#003366]">{icon}</div>
          <div className="text-left">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          // className="overflow-hidden"
          >
            <div className="px-8 pb-7 pt-1 space-y-6 border-t border-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OpenSection({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 ">
      <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-50">
        <div className="p-2 bg-blue-50 rounded-lg text-[#003366]">{icon}</div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-8 pb-7 pt-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

export default function GenerateContract() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState({ customers: [], products: [], termsOfPayment: [] });
  const [parties, setParties] = useState({ consignees: [], notifyParties: [], contactPersons: [] });
  const [partiesLoading, setPartiesLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    consigneeId: '',
    notifyPartyId: '',
    contactPersonId: '',
    termsOfPaymentId: '',
    items: [],
    countryOfOrigin: 'INDIA',
    countryOfDestination: '',
    preCarriageBy: 'Sea',
    portOfLoading: '',
    portOfFinalDestination: '',
    expectedDepartureDate: '',
    expectedDeliveryDate: '',
    packing: '',
    insurance: '',
    operatingAirlines: '',
    speacialCondition: '',
    note: '',
  });

  useEffect(() => {
    api.get('/contracts/options')
      .then(res => setOptions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!formData.customerId) {
      setParties({ consignees: [], notifyParties: [], contactPersons: [] });
      setFormData(p => ({ ...p, consigneeId: '', notifyPartyId: '', contactPersonId: '' }));
      return;
    }
    setPartiesLoading(true);
    api.get(`/contracts/customer/${formData.customerId}/parties`)
      .then(res => {
        const data = res.data;
        setParties({
          consignees: data.consignees || [],
          notifyParties: data.notifyParties || [],
          contactPersons: data.contactPersons || [],
        });
        setFormData(p => ({
          ...p,
          consigneeId: data.consignees?.[0]?.id ?? '',
          notifyPartyId: data.notifyParties?.[0]?.id ?? '',
          contactPersonId: data.contactPersons?.[0]?.id ?? '',
        }));
      })
      .catch(console.error)
      .finally(() => setPartiesLoading(false));
  }, [formData.customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateParty = async (type, formValues) => {
    const cfg = PARTY_CONFIG[type];
    const res = await api.post('/contracts/party', {
      type,
      customerId: formData.customerId,
      data: formValues,
    });
    const newParty = res.data;
    setParties(prev => ({ ...prev, [cfg.partyKey]: [...prev[cfg.partyKey], newParty] }));
    setFormData(p => ({ ...p, [cfg.formKey]: newParty.id }));
    return newParty;
  };

  const handleProductSelect = (productId) => {
    const product = options.products.find(p => p.id === productId);
    if (!product || formData.items.some(item => item.productId === productId)) return;
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId, name: product.name, skuCode: product.skuCode, quantity: 0, pricePerKg: 0, color: '' }]
    }));
  };

  const handleRemoveItem = (productId) =>
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.productId !== productId) }));

  const handleItemChange = (productId, field, value) =>
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.productId === productId ? { ...item, [field]: value } : item)
    }));

  const handleToggleAllProducts = () => {
    const allSelected = options.products.length > 0 &&
      options.products.every(p => formData.items.some(i => i.productId === p.id));
    setFormData(prev => ({
      ...prev,
      items: allSelected ? [] : options.products.map(p => ({
        productId: p.id, name: p.name, skuCode: p.skuCode, quantity: 0, pricePerKg: 0, color: ''
      }))
    }));
  };

  const getSelected = (type) => {
    const cfg = PARTY_CONFIG[type];
    return parties[cfg.partyKey]?.find(p => p.id === formData[cfg.formKey]) || null;
  };

  const totalWeight = formData.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalPrice = formData.items.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerKg) || 0)), 0);


  const validateContractForm = (data) => {
    const errors = {};

    // ── Required fields ──
    if (!data.name?.trim()) errors.name = 'Contract name is required';
    if (!data.customerId) errors.customerId = 'Customer is required';
    if (!data.portOfLoading?.trim()) errors.portOfLoading = 'Port of loading is required';
    if (!data.portOfFinalDestination?.trim()) errors.portOfFinalDestination = 'Final destination is required';
    if (!data.countryOfOrigin?.trim()) errors.countryOfOrigin = 'countryOfOrigin is required';
    if (!data.countryOfDestination?.trim()) errors.countryOfDestination = 'countryOfDestination is required';

    // ── Items check ──
    if (!data.items || data.items.length === 0) {
      errors.items = 'Please add at least one product';
    } else {
      data.items.forEach((item, idx) => {
        if (!item.quantity || Number(item.quantity) <= 0) {
          errors[`items_${idx}_quantity`] = 'Quantity must be greater than 0';
        }
        if (!item.pricePerKg || Number(item.pricePerKg) <= 0) {
          errors[`items_${idx}_price`] = 'Price must be greater than 0';
        }
      });
    }




    const isValidDate = (val) => {
      if (!val) return true;
      const d = new Date(val);
      return !isNaN(d.getTime());
    };

    if (data.expectedDepartureDate && !isValidDate(data.expectedDepartureDate)) {
      errors.expectedDepartureDate = 'Invalid departure date yyyy/MM/DD';
    }

    if (data.expectedDeliveryDate && !isValidDate(data.expectedDeliveryDate)) {
      errors.expectedDeliveryDate = 'Invalid delivery date';
    }

    // Optional logical check
    if (
      data.expectedDepartureDate &&
      data.expectedDeliveryDate &&
      new Date(data.expectedDeliveryDate) < new Date(data.expectedDepartureDate)
    ) {
      errors.dateLogic = 'Delivery date cannot be before departure date';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateContractForm(formData);

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]); // show first error
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/contracts/create', formData);
      navigate('/contracts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate contract');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
    </div>
  );

  const customerSelected = !!formData.customerId;

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/contracts')}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Generate New Contract</h1>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details to create a formal export contract</p>
          </div>
        </div>

        {/* Action buttons in header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/contracts')}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#003366] text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-xl shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-70"
          >
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              : <><Save className="w-4 h-4" /> Generate Contract</>}
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pb-10">
        <form onSubmit={handleSubmit} className=" mx-auto space-y-4 px-6 py-4 ">

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">{error}</div>
          )}

          <OpenSection icon={<Info className="w-5 h-5" />} title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBox
                title="Contract Name / Reference"
                isMandatory
                inputFor="name"
                value={formData.name}
                handleChangeFunction={handleChange}
                placeholder="e.g. DCS-Q2-2026"
              />
              <CustomSelect
                label="Buyer Customer"
                required
                options={options.customers}
                value={formData.customerId}
                onChange={(val) => setFormData(p => ({ ...p, customerId: val }))}
                placeholder="Select Customer"
              />
            </div>
          </OpenSection>

          {/* ── 2. Parties — OPEN by default ── */}
          <OpenSection
            icon={<Users className="w-5 h-5" />}
            title="Parties"
            subtitle={!customerSelected ? 'Select a customer first to load parties' : 'Auto-filled from customer — change if needed'}
          >
            {partiesLoading ? (
              <div className="flex items-center gap-3 py-6 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading parties…
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['consignee', 'notifyParty', 'contactPerson'].map(type => (
                  <PartyDetailCard
                    key={type}
                    type={type}
                    config={PARTY_CONFIG[type]}
                    list={parties[PARTY_CONFIG[type].partyKey]}
                    selectedId={formData[PARTY_CONFIG[type].formKey]}
                    selected={getSelected(type)}
                    disabled={!customerSelected}
                    onSelect={(id) => setFormData(p => ({ ...p, [PARTY_CONFIG[type].formKey]: id }))}
                    onCreate={() => setModalType(type)}
                  />
                ))}
              </div>
            )}
          </OpenSection>

          {/* ── 3. Logistics — COLLAPSED ── */}
          <AccordionSection
            icon={<Truck className="w-5 h-5" />}
            title="Logistics & Shipping"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomSelect
                label="Country of Origin"
                options={[
                  { id: 'INDIA', name: 'INDIA' },
                  { id: 'CHINA', name: 'CHINA' },
                ]}
                value={formData.countryOfOrigin}
                onChange={(val) => setFormData(p => ({ ...p, countryOfOrigin: val }))}
              />
              <CustomSelect
                label="Country of Destination"
                options={[
                  { id: 'USA', name: 'USA' },
                  { id: 'UAE', name: 'UAE' },
                  { id: 'CHINA', name: 'CHINA' },
                ]}
                value={formData.countryOfDestination}
                onChange={(val) => setFormData(p => ({ ...p, countryOfDestination: val }))}
              />
              <CustomSelect
                label="Pre-Carriage By"
                options={[{ id: 'Sea', name: 'Sea' }, { id: 'Air', name: 'Air' }, { id: 'Road', name: 'Road' }]}
                value={formData.preCarriageBy}
                onChange={(val) => setFormData(p => ({ ...p, preCarriageBy: val }))}
                searchable={false}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBox
                title="Port of Loading"
                isMandatory
                inputFor="portOfLoading"
                value={formData.portOfLoading}
                handleChangeFunction={handleChange}
                placeholder="e.g. Mundra Port"
              />
              <InputBox
                title="Port of Final Destination"
                isMandatory
                inputFor="portOfFinalDestination"
                value={formData.portOfFinalDestination}
                handleChangeFunction={handleChange}
                placeholder="e.g. New York Port"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBox
                title="Exp. Departure Date"
                type="date"
                inputFor="expectedDepartureDate"
                value={formData.expectedDepartureDate}
                handleChangeFunction={handleChange}
                placeholder="YYYY/MM/DD"
              />
              <InputBox
                type="number"
                title="Exp. Delivery Date"
                inputFor="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                handleChangeFunction={handleChange}
                placeholder="YYYY/MM/DD"
              />
            </div>
          </AccordionSection>

          {/* ── 4. Products — COLLAPSED ── */}
          <AccordionSection
            icon={<Package className="w-5 h-5" />}
            title="Product Details"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <CustomSelect
                label="Add Product"
                options={options.products}
                value=""
                onChange={handleProductSelect}
                placeholder="Search and add product..."
                toggleAll={{
                  label: options.products.length > 0 && options.products.every(p => formData.items.some(i => i.productId === p.id))
                    ? 'Unselect All Products' : 'Select All Products',
                  onClick: handleToggleAllProducts
                }}
              />
              <CustomSelect
                label="Terms of Payment"
                options={options.termsOfPayment}
                value={formData.termsOfPaymentId}
                onChange={(val) => setFormData(p => ({ ...p, termsOfPaymentId: val }))}
                placeholder="Select Payment Terms"
              />
            </div>

            {/* Table with scrollbar ONLY inside the body, not on sticky header */}
            <div className="rounded-xl border border-gray-100 ">
              <table className="w-full text-left table-fixed">
                {/* Sticky thead — NOT inside a scrollable div, sits on top */}
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                    <th className="px-4 py-3 w-[22%]">Product</th>
                    <th className="px-4 py-3 w-[12%]">SKU</th>
                    <th className="px-4 py-3 w-[18%]">Color  
                      {/* <CustomSelect
                            // label="Country of Origin"
                            options={[
                              { id: 'BLACK', name: 'BLACK' },
                              { id: 'RED', name: 'RED' },
                            ]}
                            value={item.color}
                            // onChange={}
                          /> */}
                    </th>

                    
                    <th className="px-4 py-3 w-[16%]">Qty (KG)</th>
                    <th className="px-4 py-3 w-[16%]">Price/KG</th>
                    <th className="px-4 py-3 w-[12%] text-right">Total</th>
                    <th className="px-4 py-3 w-[4%]" />
                  </tr>
                </thead>
              </table>

              {/* Scrollable body */}
              <div className="overflow-y-auto max-h-[360px]">
                <table className="w-full text-left table-fixed">
                  {/* Invisible colgroup to match header widths */}
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[12%]" />
                    <col className="w-[18%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                    <col className="w-[12%]" />
                    <col className="w-[4%]" />
                  </colgroup>
                  <tbody className="divide-y divide-gray-50">
                    {formData.items.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400 text-sm font-medium italic">
                          No products added yet.
                        </td>
                      </tr>
                    ) : formData.items.map((item) => (
                      <tr key={item.productId} className="hover:bg-gray-50/40 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 truncate">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 uppercase truncate">{item.skuCode}</td>
                        <td className="px-2 py-2">
                          {/* <InputBox
                            inputFor={`color-${item.productId}`}
                            value={item.color || ''}
                            handleChangeFunction={(e) => handleItemChange(item.productId, 'color', e.target.value)}
                            placeholder="Color"
                          /> */}

                          <CustomSelect
                            // label="Country of Origin"
                            options={[
                              { id: 'BLACK', name: 'BLACK' },
                              { id: 'RED', name: 'RED' },
                            ]}
                            value={item.color}
                            onChange={(e) => handleItemChange(item.productId, 'color', e.target.value)}
                          />

                        </td>
                        <td className="px-2 py-2">
                          <InputBox
                            inputFor={`qty-${item.productId}`}
                            type="number"
                            isDecimalAllowed
                            value={item.quantity}
                            handleChangeFunction={(e) => handleItemChange(item.productId, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <InputBox
                            inputFor={`price-${item.productId}`}
                            type="number"
                            isDecimalAllowed
                            value={item.pricePerKg}
                            handleChangeFunction={(e) => handleItemChange(item.productId, 'pricePerKg', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-[#003366]">
                          ${((parseFloat(item.quantity) || 0) * (parseFloat(item.pricePerKg) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer summary — outside the scroll area */}
              {formData.items.length > 0 && (
                <div className="bg-gray-50/60 border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-700">
                  <span>Summary</span>
                  <div className="flex items-center gap-8">
                    <span className="text-[#003366]">{totalWeight.toFixed(2)} KG</span>
                    <span className="text-lg text-[#003366]">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
          </AccordionSection>

          {/* ── 5. Additional Details — COLLAPSED ── */}
          <AccordionSection
            icon={<FileText className="w-5 h-5" />}
            title="Additional Details"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBox
                title="Packing Instructions"
                inputFor="packing"
                value={formData.packing}
                handleChangeFunction={handleChange}
                placeholder="Packing details..."
              />
              <InputBox
                title="Insurance Details"
                inputFor="insurance"
                value={formData.insurance}
                handleChangeFunction={handleChange}
                placeholder="Insurance info..."
              />
              <InputBox
                title="Operating Airlines"
                inputFor="operatingAirlines"
                value={formData.operatingAirlines}
                handleChangeFunction={handleChange}
                placeholder="Airline name..."
              />
            </div>
            <InputBox
              title="Special Conditions"
              inputFor="speacialCondition"
              value={formData.speacialCondition}
              handleChangeFunction={handleChange}
              placeholder="Any special conditions..."
            />
            <InputBox
              title="Please Note"
              inputFor="note"
              value={formData.note}
              handleChangeFunction={handleChange}
              placeholder="Additional notes..."
            />
          </AccordionSection>

        </form>
      </div>

      {/* Party Modal */}
      <AnimatePresence>
        {modalType && (
          <PartyFormModal
            type={modalType}
            onClose={() => setModalType(null)}
            onSave={(values) => handleCreateParty(modalType, values)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
