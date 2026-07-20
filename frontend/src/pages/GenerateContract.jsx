

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FileText, ArrowLeft, Loader2, Save, Info, Truck, Package, Trash2, Users, ChevronDown,
  Mail,
  MapPin,
  Phone,
  Hash,
  Navigation,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';
import InputBox from '../components/InputBox';
import toast from 'react-hot-toast';
import { useAddCustomerPartyMutation, useGetCustomerbyIdMutation } from '../customerapiSlice/apiSlicecustomer';
import { useCreateContractMutation, useGetcontractOptionsMutation } from './contractApi/contractApiSlice';
import { useGetAllColorSizeMutation } from './productApi/ProductApiSlice';
import PartySelector from '../components/AddPartyModal';
import PartySection from '../components/AddPartyModal';
import { AddProductForm } from '../components/AddProduct';
import MultiSelect from '../components/MultiSelect';

const PARTY_TYPES = {
  consignee: { label: 'Consignee', partyKey: 'consignees', formKey: 'consigneeId' },
  notifyParty: { label: 'Notify Party', partyKey: 'notifyParties', formKey: 'notifyPartyId' },
  contactPerson: { label: 'Contact Person', partyKey: 'contactPersons', formKey: 'contactPersonId' },
};

function AccordionSection({ icon, title, subtitle, defaultOpen = false, children, disabled }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 `}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-8 py-3 hover:bg-gray-50/50 transition-colors group ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
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
        {open && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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
      <div className="flex items-center gap-3 px-8 py-3 border-b border-gray-50">
        <div className="p-2 bg-blue-50 rounded-lg text-[#003366]">{icon}</div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-8 pb-3 pt-1 space-y-6">
        {children}
      </div>
    </div>
  );
}


const initialform = {
  contractname: '',
  customerId: '',
  consigneeId: '',
  notifyPartyId: '',
  contactPersonId: '',
  termsOfPaymentId: '',
  paymentterm: '',
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
  currency: '',
  sizeScale: '',
  otherref: '',
  description: '',
  shipingMark: '',
}

export default function GenerateContract() {
  const navigate = useNavigate();
  const [options, setOptions] = useState({ customers: [], products: [], termsOfPayment: [] });
  const [parties, setParties] = useState({ consignees: [], notifyParties: [], contactPersons: [] });
  const [colorsize, setcolorsize] = useState({ colors: [], sizes: [] });
  const [sizes, setSizes] = useState([]);
  const [color, setcolor] = useState([]);
  const colorOptions = colorsize?.colors?.map((item) => ({ id: item.color, name: item.color, })) || [];
  const sizeOptions = colorsize?.sizes?.map((item) => ({ id: item.size, name: item.size, })) || [];

  const [formData, setFormData] = useState(initialform);
  const [getCustomerbyId, { data: res, isLoading: partiesLoading }] = useGetCustomerbyIdMutation();
  const fetchparty = res?.data;
  const defaultsAppliedFor = useRef(null);
  const [getcontractOptions, { isLoading: loading }] = useGetcontractOptionsMutation();
  const [addCustomerParty] = useAddCustomerPartyMutation();
  const [createContract, { isLoading: submitting }] = useCreateContractMutation();
  const [getAllColorSize] = useGetAllColorSizeMutation();
  const [productmodel, setproductmodel] = useState(false)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await getcontractOptions().unwrap();
        if (res?.success) {
          setOptions(res.data);
          // toast.success('Fetch data successfully');
        }
      } catch (error) {
        console.error('Option API Error:', error);
        toast.error(error?.data?.message || error?.message || 'Failed to fetch option API'
        );
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const colorsize = async () => {
      try {
        const res = await getAllColorSize().unwrap();
        if (res?.success) {
          setcolorsize(res?.data)
        }
      } catch (error) {
        console.error('fail to fetch color option', error.message)
        toast.error(error.data?.message || error.message || 'fail to fetch color&size option')
      }
    }

    colorsize();
  }, [formData.customerId])


  useEffect(() => {
    if (!formData.customerId) {
      setParties({
        consignees: [],
        notifyParties: [],
        contactPersons: [],
      });

      // Only the party selections are customer-dependent — clear those,
      // but leave name, logistics, items, and every other field untouched.
      setFormData(p => ({
        ...p,
        consigneeId: '',
        notifyPartyId: '',
        contactPersonId: '',
      }));

      defaultsAppliedFor.current = null;
      return;
    }
    getCustomerbyId(formData.customerId);
  }, [formData.customerId]);

  useEffect(() => {
    if (fetchparty) {
      setParties({
        consignees: fetchparty.consignees || [],
        notifyParties: fetchparty.notifyParties || [],
        contactPersons: fetchparty.contactPersons || [],
      });


      if (defaultsAppliedFor.current !== formData.customerId) {
        setFormData(p => ({
          ...p,
          consigneeId: fetchparty.consignees?.[0]?.id ?? '',
          notifyPartyId: fetchparty.notifyParties?.[0]?.id ?? '',
          contactPersonId: fetchparty.contactPersons?.[0]?.id ?? '',
        }));
        defaultsAppliedFor.current = formData.customerId;
      }
    }
  }, [fetchparty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePartyApi = async (type, formValues) => {
    const res = await addCustomerParty({ type, customerId: formData.customerId, data: formValues, }).unwrap();
    await getCustomerbyId(formData.customerId).unwrap();
    return res.data;
  };

  // Builds one row per product × color × size combination. `productId` stays
  // the real, product-level id (shared by every combo row of that product);
  // `rowId` is the unique per-combination key used for edits/removal.
  const buildComboRows = (product, existingItems) => {
    const colorsArr = color.length ? color : [null];
    const sizesArr = sizes.length ? sizes : [null];
    const rows = [];

    colorsArr.forEach((c) => {
      sizesArr.forEach((s) => {
        const rowId = `${product.id}::${c ?? 'none'}::${s ?? 'none'}`;
        const alreadyExists = existingItems.some((item) => item.rowId === rowId);
        if (!alreadyExists) {
          rows.push({
            rowId,
            productId: product.id,
            name: product.name,
            skuCode: product.skuCode,
            color: c,
            size: s,
            weight: 0,
            pricePerKg: 0,
          });
        }
      });
    });

    return rows;
  };

  const handleProductSelect = (productId) => {
    const product = options.products.find(p => p.id === productId);
    if (!product) return;

    setFormData(prev => {
      const newRows = buildComboRows(product, prev.items);
      if (newRows.length === 0) return prev;
      return { ...prev, items: [...prev.items, ...newRows] };
    });
  };

  const handleRemoveItem = (rowId) =>
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.rowId !== rowId) }));

  const handleItemChange = (rowId, field, value) =>
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.rowId === rowId ? { ...item, [field]: value } : item)
    }));

  const handleToggleAllProducts = () => {
    const allSelected = options.products.length > 0 &&
      options.products.every(p => formData.items.some(i => i.productId === p.id));

    setFormData(prev => {
      if (allSelected) {
        const productIds = new Set(options.products.map(p => p.id));
        return { ...prev, items: prev.items.filter(item => !productIds.has(item.productId)) };
      }

      const newRows = options.products.flatMap(p => buildComboRows(p, prev.items));
      return { ...prev, items: [...prev.items, ...newRows] };
    });
  };

  const totalWeight = formData.items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
  const totalPrice = formData.items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0) * (parseFloat(item.pricePerKg) || 0), 0);

  // Keep the table in sync whenever Colors or Sizes change: every product
  // already in the table gets its rows recomputed against the new color ×
  // size combinations — new combos are added, dropped combos are removed,
  // and weight/price already entered for a combo that still exists is kept.
  useEffect(() => {
    setFormData(prev => {
      const activeProductIds = [...new Set(prev.items.map(item => item.productId))];
      if (activeProductIds.length === 0) return prev;

      const colorsArr = color.length ? color : [null];
      const sizesArr = sizes.length ? sizes : [null];
      const prevByRowId = new Map(prev.items.map(item => [item.rowId, item]));

      const nextItems = [];

      activeProductIds.forEach((productId) => {
        const sample = prev.items.find(item => item.productId === productId);

        colorsArr.forEach((c) => {
          sizesArr.forEach((s) => {
            const rowId = `${productId}::${c ?? 'none'}::${s ?? 'none'}`;
            const existing = prevByRowId.get(rowId);

            nextItems.push(
              existing || {
                rowId,
                productId,
                name: sample.name,
                skuCode: sample.skuCode,
                color: c,
                size: s,
                weight: 0,
                pricePerKg: 0,
              }
            );
          });
        });
      });

      return { ...prev, items: nextItems };
    });

  }, [color, sizes]);

  const validateContractForm = (data) => {
    const errors = {};

    if (!data.contractname?.trim()) errors.contractname = 'Contract name is required';
    if (!data.customerId) errors.customerId = 'Customer is required';
    if (!data.portOfLoading?.trim()) errors.portOfLoading = 'Port of loading is required';
    if (!data.portOfFinalDestination?.trim()) errors.portOfFinalDestination = 'Final destination is required';
    if (!data.countryOfOrigin?.trim()) errors.countryOfOrigin = 'countryOfOrigin is required';
    if (!data.countryOfDestination?.trim()) errors.countryOfDestination = 'countryOfDestination is required';

    if (!data.items || data.items.length === 0) {
      errors.items = 'Please add at least one product';
    } else {
      data.items.forEach((item, idx) => {
        if (!item.weight || Number(item.weight) <= 0) {
          errors[`items_${idx}_weight`] = 'weight must be greater than 0';
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

    if (
      data.expectedDepartureDate &&
      data.expectedDeliveryDate &&
      new Date(data.expectedDeliveryDate) < new Date(data.expectedDepartureDate)
    ) {
      errors.dateLogic = 'Delivery date cannot be before departure date';
    }

    return errors;
  };

  const buildContractPayload = (formData) => {
    return {
      contractname: formData.contractname.trim(),

      customerId: Number(formData.customerId),

      consigneeId: formData.consigneeId
        ? Number(formData.consigneeId)
        : null,

      notifyPartyId: formData.notifyPartyId
        ? Number(formData.notifyPartyId)
        : null,

      contactPersonId: formData.contactPersonId
        ? Number(formData.contactPersonId)
        : null,

      termsOfPaymentId: Number(formData.termsOfPaymentId),

      paymentterm: formData.paymentterm,

      operatingAirlines: formData.operatingAirlines,

      preCarriageBy: formData.preCarriageBy,

      countryOfOrigin: formData.countryOfOrigin,

      countryOfDestination: formData.countryOfDestination,

      portOfLoading: formData.portOfLoading,

      portOfFinalDestination: formData.portOfFinalDestination,

      expectedDepartureDate: formData.expectedDepartureDate,

      expectedDeliveryDate: formData.expectedDeliveryDate,

      description: formData.description,

      packing: formData.packing,

      insurance: formData.insurance,

      shipingMark: formData.shipingMark,

      cartonweight: Number(formData.cartonweight || 0),

      sizeScale: formData.sizeScale,

      currency: formData.currency,

      otherref: formData.otherref,

      flightNo: formData.flightNo,

      items: formData.items.map((item) => {
        const weight = Number(item.weight);
        const pricePerKg = Number(item.pricePerKg);

        return {
          productId: Number(item.productId),
          weight,
          pricePerKg,
          color: item.color || "",
          size: item.size || "",
          Amount: weight * pricePerKg,
        };
      }),
    };
  };
  //submit
  const handleSubmit = async () => {

    const payload = buildContractPayload(formData);
    const errors = validateContractForm(payload);
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]); // show first error
      return;
    }

    try {
      const res = await createContract(payload).unwrap();
      if (res?.success) {
        toast.success(res.message)
        navigate('/contracts');
      }
    } catch (err) {
      console.error('contract create Error', err)
      toast.error(err?.data?.message || err?.message || 'fail to create contract')
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

      <div className="flex-1 overflow-y-auto pb-10">
        <div className=" mx-auto space-y-4 px-6 py-4 ">
          <div className='space-y-1'>

            <OpenSection icon={<Info className="w-5 h-5" />} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                  title="Contract Name / Reference"
                  isMandatory
                  inputFor="contractname"
                  value={formData.contractname}
                  handleChangeFunction={handleChange}
                  placeholder="-"
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

            {/* ── 2. Parties ── */}
            <AccordionSection
              icon={<Users className="w-5 h-5" />}
              title="Parties"
              subtitle={!customerSelected ? 'Select a customer first to load parties' : 'Auto-filled from customer — change if needed'}
              disabled={!customerSelected}
            >
              {partiesLoading ? (
                <div className="flex items-center gap-3 py-6 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading parties…
                </div>
              ) : (
                <div>
                  <PartySection
                    customer={fetchparty}
                    parties={parties}
                    values={formData}
                    disabled={!customerSelected}
                    onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value, }))}
                    onCreateParty={handleCreatePartyApi}
                    onPartyCreated={() => { }}
                  // onPartyCreated={(partyKey, party) => setParties((prev) => ({ ...prev, [partyKey]: [...prev[partyKey], party], }))}
                  />
                </div>
              )}
            </AccordionSection>

            {/* ── 3. Logistics ── */}
            <AccordionSection
              icon={<Truck className="w-5 h-5" />}
              title="Logistics & Shipping"
              defaultOpen={false}
              disabled={!customerSelected}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                <InputBox
                  title="shipingMark"
                  inputFor="shipingMark"
                  value={formData.shipingMark}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />

                <InputBox
                  title="Port of Loading"
                  isMandatory
                  inputFor="portOfLoading"
                  value={formData.portOfLoading}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
                <InputBox
                  title="Port of Final Destination"
                  isMandatory
                  inputFor="portOfFinalDestination"
                  value={formData.portOfFinalDestination}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
                <InputBox
                  title="Exp. Departure Date"
                  type="date"
                  inputFor="expectedDepartureDate"
                  value={formData.expectedDepartureDate}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
                <InputBox
                  type="date"
                  title="Exp. Delivery Date"
                  inputFor="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
                <CustomSelect
                  label="Terms of Payment"
                  options={options.termsOfPayment}
                  value={formData.termsOfPaymentId}
                  onChange={(val) => setFormData(p => ({ ...p, termsOfPaymentId: val }))}
                  placeholder="-"
                />
                <CustomSelect
                  label="Payment Term"
                  placeholder="-"
                  options={[
                    { id: "CIF", name: "CIF" },
                    { id: "CFR", name: "CFR" },
                    { id: "CPT", name: "CPT" },
                  ]}
                  value={formData.paymentterm}
                  onChange={(val) => setFormData(p => ({ ...p, paymentterm: val }))}
                />
                <InputBox
                  title="Operating Airlines"
                  inputFor="operatingAirlines"
                  value={formData.operatingAirlines}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />

                <InputBox
                  title="Flight No."
                  inputFor="flightNo"
                  value={formData.flightNo}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
              </div>
            </AccordionSection>

            {/* ── 4. Products ── */}
            <AccordionSection
              icon={<Package className="w-5 h-5" />}
              title="Product Details"
              defaultOpen={false}
              disabled={!customerSelected}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                  <MultiSelect
                    label="Default Colors"
                    options={colorOptions}
                    value={color}
                    onChange={setcolor}
                  />

                  <MultiSelect
                    label="Default Sizes"
                    options={sizeOptions}
                    value={sizes}
                    onChange={setSizes}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 ">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                      <th className="px-4 py-3 w-[18%]">Product</th>
                      <th className="px-4 py-3 w-[9%]">SKU</th>
                      <th className="px-4 py-3 w-[16%]">Color</th>
                      <th className="px-4 py-3 w-[16%]">Size</th>
                      <th className="px-4 py-3 w-[13%]">Weight(KG)</th>
                      <th className="px-4 py-3 w-[13%]">Price/KG</th>
                      <th className="px-4 py-3 w-[11%] text-right">Total</th>
                      <th className="px-4 py-3 w-[4%]" />
                    </tr>
                  </thead>
                </table>

                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left table-fixed">
                    <colgroup>
                      <col className="w-[18%]" />
                      <col className="w-[9%]" />
                      <col className="w-[16%]" />
                      <col className="w-[16%]" />
                      <col className="w-[13%]" />
                      <col className="w-[13%]" />
                      <col className="w-[11%]" />
                      <col className="w-[4%]" />
                    </colgroup>
                    <tbody className="divide-y divide-gray-50">
                      {formData.items.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-gray-400 text-sm font-medium italic">
                            No products added yet.
                          </td>
                        </tr>
                      ) : formData.items.map((item) => (
                        <tr key={item.rowId} className="hover:bg-gray-50/40 transition-colors align-top">
                          <td className="px-4 py-0 text-sm font-bold text-gray-900 truncate">{item.name}</td>
                          <td className="px-4 py-0 text-xs text-gray-500 uppercase truncate">{item.skuCode}</td>
                          <td className="px-4 py-0 text-sm text-gray-700 truncate">{item.color || '—'}</td>
                          <td className="px-4 py-0 text-sm text-gray-700 truncate">{item.size || '—'} {formData.sizeScale}</td>
                          <td className="px-4 py-0">
                            <InputBox
                              inputFor={`qty-${item.rowId}`}
                              type="number"
                              isDecimalAllowed
                              value={item.weight}
                              handleChangeFunction={(e) => handleItemChange(item.rowId, 'weight', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-0">
                            <InputBox
                              inputFor={`price-${item.rowId}`}
                              type="number"
                              isDecimalAllowed
                              value={item.pricePerKg}
                              handleChangeFunction={(e) => handleItemChange(item.rowId, 'pricePerKg', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-0 text-right text-sm font-bold text-[#003366]">
                            {
                              (
                                (parseFloat(item.weight) || 0) *
                                (parseFloat(item.pricePerKg) || 0)
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            }
                          </td>
                          <td className="px-4 py-0 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.rowId)}
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

                {formData.items.length > 0 && (
                  <div className="bg-gray-50/60 border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-700">
                    <span>Summary</span>
                    <div className="flex items-center gap-8">
                      <span className="text-[#003366]">{totalWeight.toFixed(2)} KG</span>
                      <span className="text-lg text-[#003366]">{formData.currency} {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <InputBox
                  title="cartonweight"
                  inputFor="cartonweight"
                  value={formData.cartonweight}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />

                <CustomSelect
                  label="Currency"
                  options={[
                    { id: "USD", name: "USD" },
                    { id: "INR", name: "INR" },
                    { id: "EUR", name: "EUR" },
                  ]}
                  value={formData.currency}
                  onChange={(val) => setFormData(p => ({ ...p, currency: val }))}
                  searchable={false}
                />

                <CustomSelect
                  label="Size Scale"
                  options={[
                    { id: "inch", name: "inch" },
                    { id: "cm", name: "cm" },
                    { id: "m", name: "m" },
                  ]}
                  value={formData.sizeScale}
                  onChange={(val) => setFormData(p => ({ ...p, sizeScale: val }))}
                  searchable={false}
                />
              </div>
            </AccordionSection>

            {/* ── 5. Additional Details ── */}
            <AccordionSection
              icon={<FileText className="w-5 h-5" />}
              title="Additional Details"
              defaultOpen={false}
              disabled={!customerSelected}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                  title="Packing Instructions"
                  inputFor="packing"
                  value={formData.packing}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
                <InputBox
                  title="Insurance Details"
                  inputFor="insurance"
                  value={formData.insurance}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />

                <InputBox
                  title="other Reference"
                  inputFor="otherref"
                  value={formData.otherref}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />

                <InputBox
                  title="description of goods"
                  inputFor="description"
                  value={formData.description}
                  handleChangeFunction={handleChange}
                  placeholder="-"
                />
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>


     

    </div>
  );
}