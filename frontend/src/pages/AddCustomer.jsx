
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  ArrowLeft, Loader2, Save, Home,
  ChevronDown, Users, Bell, Phone as PhoneIcon, Building2,
  UserPlus
} from 'lucide-react';
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

function PartyFields({ data, onChange, prefix }) {
  return (
    <div className="space-y-5 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBox
          title="Full Name"
          isMandatory
          inputFor={`${prefix}-name`}
          value={data.name}
          placeholder="e.g. Acme Corp"
          handleChangeFunction={e => onChange('name', e.target.value)}
        />
        <InputBox
          title="Email Address"
          isMandatory
          inputFor={`${prefix}-email`}
          value={data.email}
          placeholder="contact@company.com"
          handleChangeFunction={e => onChange('email', e.target.value)}
        />
        <InputBox
          title="Primary Phone"
          isMandatory
          inputFor={`${prefix}-phone`}
          value={data.phone}
          placeholder="+1 234 567 8900"
          handleChangeFunction={e => onChange('phone', e.target.value)}
        />
        <InputBox
          title="Alternate Phone"
          inputFor={`${prefix}-altPhone`}
          value={data.altPhone}
          placeholder="Optional"
          handleChangeFunction={e => onChange('altPhone', e.target.value)}
        />
      </div>

      <div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputBox
              title="Street Address"
              isMandatory
              inputFor={`${prefix}-address`}
              value={data.address}
              placeholder="Apartment, Street, Area"
              handleChangeFunction={e => onChange('address', e.target.value)}
            />
          </div>
          <InputBox
            title="City"
            isMandatory
            inputFor={`${prefix}-city`}
            value={data.city}
            placeholder="e.g. Mumbai"
            handleChangeFunction={e => onChange('city', e.target.value)}
          />
          <InputBox
            title="State / Province"
            isMandatory
            inputFor={`${prefix}-state`}
            value={data.state}
            placeholder="e.g. Maharashtra"
            handleChangeFunction={e => onChange('state', e.target.value)}
          />
          <InputBox
            title="Postal Code"
            isMandatory
            inputFor={`${prefix}-pinCode`}
            value={data.pinCode}
            placeholder="e.g. 122506"
            type="number"
            handleChangeFunction={e => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 6) onChange('pinCode', val);
            }}
          />
          <InputBox
            title="USCI No."
            isMandatory
            inputFor={`${prefix}-usciNo`}
            value={data.usciNo}
            placeholder="e.g. 658565423534658"
            handleChangeFunction={e => onChange('usciNo', e.target.value)}
          />
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

function AccordionSection({ icon: Icon, title, subtitle, color, isOpen, onToggle, children, badge }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${isOpen ? 'border-[#003366]/20' : 'border-gray-100 hover:border-gray-200'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            {!isOpen && subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 pb-6 border-t border-gray-50">
          {children}
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

export default function AddCustomer() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggle = (key) => setOpenSection(prev => prev === key ? null : key);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', altPhone: '',
    address: '', city: '', state: '', usciNo: '', pinCode: '', country: 'India',
    consignees: [{ ...emptyParty }],
    notifyParties: [{ ...emptyParty }],
    contactPersons: [{ ...emptyParty }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartyChange = (partyType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [partyType]: [{ ...prev[partyType][0], [field]: value }],
    }));
  };

  const partySummary = (arr) =>
    hasFilled(arr) ? null : 'Click to expand and fill details';

  const hasFilled = (arr) => {
    const item = arr?.[0];
    const requiredFields = [
      'name',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'pinCode',
      'usciNo',
      'country'
    ];

    return requiredFields.every(field =>
      String(item?.[field] || '').trim()
    );
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'email', label: 'Email Address' },
      { key: 'address', label: 'Street Address' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State / Province' },
      { key: 'pinCode', label: 'Postal Code' },
      { key: 'usciNo', label: 'USCI No.' }
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]?.trim()) {
        toast.error(`${field.label} is required`);
        return false;
      }
    }

    if (formData.pinCode.length !== 6) {
      toast.error('Postal Code must be exactly 6 digits');
      return false;
    }

    const validateParty = (party, sectionName) => {
      if (party.name.trim()) {
        const partyRequired = [
          'email',
          'phone',
          'address',
          'city',
          'state',
          'pinCode',
          'usciNo'
        ];

        for (const field of partyRequired) {
          if (!party[field]?.trim()) {
            toast.error(`${sectionName}: ${field} is required`);
            return false;
          }
        }

        if (party.pinCode.length !== 6) {
          toast.error(`${sectionName}: Postal Code must be 6 digits`);
          return false;
        }
      }

      return true;
    };

    if (!validateParty(formData.consignees[0], 'Consignee')) return false;
    if (!validateParty(formData.notifyParties[0], 'Notify Party')) return false;
    if (!validateParty(formData.contactPersons[0], 'Contact Person')) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        consignees: formData.consignees.filter(c => c.name.trim()),
        notifyParties: formData.notifyParties.filter(n => n.name.trim()),
        contactPersons: formData.contactPersons.filter(cp => cp.name.trim()),
      };
      await api.post('/customers', payload);
      toast.success("success added")
      navigate('/customers');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/customers')}
              className="p-2.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-gray-600 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title Section */}
            <div className="flex items-center gap-3">

              {/* Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                <UserPlus className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  Add New Customer
                </h1>
                <p className="text-xs text-gray-500">
                  Create a new client profile with contact details
                </p>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <UserPlus className="w-4 h-4" />
              New Entry
            </div>

          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="mx-auto space-y-4 p-6 pb-20">

          {/* ── Buyer Details (always visible) ─────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
              <div className="p-2 bg-blue-50 rounded-lg text-[#003366]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Buyer Details</h2>
                <p className="text-xs text-gray-400">Primary customer information</p>
              </div>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-100">
                Required
              </span>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  title="Buyer Name"
                  isMandatory
                  inputFor="name"
                  value={formData.name}
                  placeholder="e.g. Acme Corp"
                  handleChangeFunction={handleInputChange}
                />
                <InputBox
                  title="Email Address"
                  isMandatory
                  inputFor="email"
                  value={formData.email}
                  placeholder="contact@company.com"
                  handleChangeFunction={handleInputChange}
                />
                <InputBox
                  title="Primary Phone"
                  inputFor="phone"
                  value={formData.phone}
                  placeholder="+1 234 567 8900"
                  handleChangeFunction={handleInputChange}
                />
                <InputBox
                  title="Alternate Phone"
                  inputFor="altPhone"
                  value={formData.altPhone}
                  placeholder="Optional"
                  handleChangeFunction={handleInputChange}
                />
              </div>

              <div className="border-t border-dashed border-gray-100 pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Home className="w-3 h-3" /> Address
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <InputBox
                      title="Street Address"
                      isMandatory
                      inputFor="address"
                      value={formData.address}
                      placeholder="Apartment, Street, Area"
                      handleChangeFunction={handleInputChange}
                    />
                  </div>
                  <InputBox
                    title="City"
                    isMandatory
                    inputFor="city"
                    value={formData.city}
                    placeholder="e.g. Mumbai"
                    handleChangeFunction={handleInputChange}
                  />
                  <InputBox
                    title="State / Province"
                    isMandatory
                    inputFor="state"
                    value={formData.state}
                    placeholder="e.g. Maharashtra"
                    handleChangeFunction={handleInputChange}
                  />
                  <InputBox
                    title="Postal Code"
                    isMandatory
                    inputFor="pinCode"
                    value={formData.pinCode}
                    placeholder="e.g. 122506"
                    type="number"
                    handleChangeFunction={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 6) setFormData(p => ({ ...p, pinCode: val }));
                    }}
                  />
                  <InputBox
                    title="USCI No."
                    isMandatory
                    inputFor="usciNo"
                    value={formData.usciNo}
                    placeholder="e.g. 658565423534658"
                    handleChangeFunction={handleInputChange}
                  />
                  <div className="md:col-span-2">
                    <CustomSelect
                      label="Country"
                      options={allCountries.map(c => ({ id: c, name: c }))}
                      value={formData.country}
                      onChange={val => setFormData(p => ({ ...p, country: val }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {partySections.map(section => (
            <AccordionSection
              key={section.key}
              icon={section.icon}
              title={section.title}
              subtitle={partySummary(formData[section.key])}
              color={section.color}
              isOpen={openSection === section.key}
              onToggle={() => toggle(section.key)}
              badge={hasFilled(formData[section.key]) ? 'Filled' : `Unfilled`}
            >
              <PartyFields
                prefix={section.key}
                data={formData[section.key][0]}
                onChange={(field, val) => handlePartyChange(section.key, field, val)}
              />
            </AccordionSection>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-white transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-[#003366] text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#003366]/20 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                : <><Save className="w-4 h-4" /> Save Customer</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}