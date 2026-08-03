


import { AnimatePresence, motion } from "framer-motion";
import InputBox from "../components/InputBox";
import { useCallback } from "react";
import { Anchor, Building2, Calendar, ChevronRight, Container, FileText, Hash, Landmark, Loader2, MapPin, Package, Phone, Plane, Train, Truck, User } from "lucide-react";
import CustomCheckBox from "../components/CustomCheckBox";


const MetaPill = ({ label, value }) =>
  value ? (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <ChevronRight className="w-2.5 h-2.5 text-[#003366]" />
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  ) : null;


const Section = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="border border-slate-200 rounded-2xl "
  >
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500">{title}</h3>
    </div>
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
      {children}
    </div>
  </motion.div>
);


function CheckboxDateField({
  label,
  checked,
  onChange,
  name,
  dateValue,
  dateField,
  setForm,
  markDirty,
}) {

  const handleDateChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [dateField]: value,
    }));

    markDirty?.(dateField, value);
  };

  return (
    <div className="flex flex-col gap-2">

      <CustomCheckBox
        label={label}
        checked={checked}
        onChange={onChange}
        name={name}
      />

      {checked && (
        <InputBox
          type="date"
          value={dateValue || ""}
          handleChangeFunction={handleDateChange}
          inputFor={dateField}
        />
      )}

    </div>
  );
}

export default function ShipmentTrackingForm({
  selectedInvoiceId,
  originalData,
  invoiceFetching,
  dirtyData,
  markDirty,
  setDirtyData,
  form,
  setform,
}) {


  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
    markDirty(name, value);
  }, [markDirty, setform]);


  const handleCheckbox = (field, dateField) => (checked) => {
    setform((prev) => ({
      ...prev,
      [field]: checked,
      ...(dateField && !checked ? { [dateField]: "" } : {}),
    }));

    markDirty(field, checked);

    if (!checked && dateField) {
      markDirty(dateField, "");
    }
  };

  return (

    <div className="flex flex-col h-[calc(100vh-15vh)] bg-slate-50">
      {/* <div className="shrink-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="flex items-center justify-between gap-4 px-6 py-3"> */}

      {/* Invoice meta strip */}
      {/* <AnimatePresence>
            {originalData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100"
              >
                <MetaPill label="Invoice" value={originalData.invoiceNo} />
                <MetaPill label="Date" value={originalData.invoiceDate?.slice(0, 10)} />
                <MetaPill label="Buyer" value={originalData.customer?.name} />
                <MetaPill label="Country" value={originalData.customer?.country} />
                <MetaPill label="Amount" value={originalData.totalAmount} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div> */}

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {!selectedInvoiceId ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-slate-400"
            >
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                <Landmark className="w-7 h-7 text-slate-300" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-500">No Invoice Selected</p>
                <p className="text-xs text-slate-400">Select an invoice from the dropdown above to begin</p>
              </div>
            </motion.div>
          ) : invoiceFetching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <Loader2 className="w-6 h-6 animate-spin text-[#003366]" />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-6 space-y-5 max-w-6xl mx-auto"
            >

              {/* <Section title="invoice" icon={Landmark} delay={0.05}>


                <InputBox
                  title="Invoice No."
                  value={form.invoiceNo}
                  handleChangeFunction={handleChange}
                  inputFor="invoiceNo"
                  placeholder="-"
                  isInputBoxDisabled
                  icon={<Hash size={13} />}
                />
                <InputBox
                  title="Invoice Date"
                  value={form.invoiceDate}
                  handleChangeFunction={handleChange}
                  inputFor="invoiceDate"
                  type="date"
                  isInputBoxDisabled
                  icon={<Calendar size={13} />}
                />
                <InputBox
                  title="Buyer"
                  value={originalData.customer?.name}
                  handleChangeFunction={handleChange}
                  inputFor="buyer"
                  placeholder="-"
                  isInputBoxDisabled
                />

                <InputBox
                  title="Net Weight (KG)"
                  value={form.packing * 25}
                  handleChangeFunction={handleChange}
                  inputFor="netWeight"
                  placeholder="-"
                  icon={<Package size={13} />}
                  isInputBoxDisabled
                />
                <InputBox
                  title="Gross Weight (KG)"
                  value={form.grossWeight}
                  handleChangeFunction={handleChange}
                  inputFor="grossWeight"
                  placeholder="-"
                  isInputBoxDisabled
                />
                <InputBox
                  title="Total Amount"
                  value={form.totalAmount}
                  handleChangeFunction={handleChange}
                  inputFor="totalAmount"
                  placeholder="-"
                  isSufixOrPrefix="prefix"
                  measure="USD"
                  isInputBoxDisabled
                />


                <InputBox
                  title="No. of Cartons"
                  value={form.packing}
                  handleChangeFunction={handleChange}
                  inputFor="noOfCartons"
                  placeholder="-"
                  icon={<Container size={13} />}
                  isInputBoxDisabled
                />
                <InputBox
                  title="S. Mark"
                  value={form.smark}
                  handleChangeFunction={handleChange}
                  inputFor="smark"
                  placeholder="-"
                  isInputBoxDisabled
                />
                <InputBox
                  title="B/L or AWB No."
                  value={form.awbNo}
                  handleChangeFunction={handleChange}
                  inputFor="blAwbNo"
                  placeholder="-"
                  isInputBoxDisabled
                />

                <InputBox
                  title="Shipping Bill No."
                  value={form.shippingBillNo}
                  handleChangeFunction={handleChange}
                  inputFor="shippingBillNo"
                  placeholder="-"
                  icon={<FileText size={13} />}
                  isInputBoxDisabled
                />
                <InputBox
                  title="Shipping Bill Date"
                  type="date"
                  value={form.shippingBillDate}
                  handleChangeFunction={handleChange}
                  inputFor="shippingBillDate"
                  icon={<Calendar size={13} />}
                  isInputBoxDisabled
                />

              </Section> */}

              <Section title="invoice" icon={Landmark} delay={0.05}>
                <InputBox
                  title="Factory Code"
                  value={form.factoryCode}
                  handleChangeFunction={handleChange}
                  inputFor="factoryCode"
                  placeholder="-"
                  icon={<Building2 size={13} />}
                />
                <InputBox
                  title="Lorry No(s)"
                  value={form.lorryNo}
                  handleChangeFunction={handleChange}
                  inputFor="lorryNo"
                  placeholder="-"
                  icon={<Truck size={13} />}
                />

                <InputBox
                  title="Driver(s) Name"
                  value={form.driverName}
                  handleChangeFunction={handleChange}
                  inputFor="driverName"
                  placeholder="-"
                  icon={<User size={13} />}
                />
                <InputBox
                  title="Mobile No."
                  type="number"
                  value={form.mobileNo}
                  handleChangeFunction={handleChange}
                  inputFor="mobileNo"
                  placeholder="-"
                  icon={<Phone size={13} />}
                />

                <InputBox
                  title="Shipment Taken By"
                  value={form.shipmentTakenBy}
                  handleChangeFunction={handleChange}
                  inputFor="shipmentTakenBy"
                  placeholder="Person name"
                  icon={<User size={13} />}
                />
                <InputBox
                  title="Port"
                  value={form.port}
                  handleChangeFunction={handleChange}
                  inputFor="port"
                  placeholder="-"
                  icon={<Anchor size={13} />}
                />

                <InputBox
                  title="Shipment Handed Over To"
                  value={form.shipmentHandedOverTo}
                  handleChangeFunction={handleChange}
                  inputFor="shipmentHandedOverTo"
                  placeholder="-"
                  icon={<MapPin size={13} />}
                />

                <CheckboxDateField
                  label="Stock Out From PKS"
                  checked={form.stockOutFromPKS}
                  onChange={handleCheckbox("stockOutFromPKS", "stockOutFromPKSDate")}
                  name="stockOutFromPKS"
                  dateValue={form.stockOutFromPKSDate}
                  dateField="stockOutFromPKSDate"
                  setForm={setform}
                  markDirty={markDirty}
                />


                <CheckboxDateField
                  label="Lorry IN Custom Warehouse"
                  checked={form.lorryInCustomWarehouse}
                  onChange={handleCheckbox("lorryInCustomWarehouse", "lorryInCustomWarehouseDateTime")}
                  name="lorryInCustomWarehouse"
                  dateValue={form.lorryInCustomWarehouseDateTime}
                  dateField="lorryInCustomWarehouseDateTime"
                  setForm={setform}
                  markDirty={markDirty}
                />

                <CheckboxDateField
                  label="Lorry Out Custom Warehouse"
                  checked={form.lorryOutFromCustomWarehouse}
                  onChange={handleCheckbox("lorryOutFromCustomWarehouse", "lorryOutFromCustomWarehouseDateTime")}
                  name="lorryOutFromCustomWarehouse"
                  dateValue={form.lorryOutFromCustomWarehouseDateTime}
                  dateField="lorryOutFromCustomWarehouseDateTime"
                  setForm={setform}
                  markDirty={markDirty}
                />


                <CheckboxDateField
                  label="Passed Shipment From Custom"
                  checked={form.passedShipmentFromCustom}
                  onChange={handleCheckbox("passedShipmentFromCustom", "passedShipmentFromCustomDate")}
                  name="passedShipmentFromCustom"
                  dateValue={form.passedShipmentFromCustomDate}
                  dateField="passedShipmentFromCustomDate"
                  setForm={setform}
                  markDirty={markDirty}
                />

              </Section>

              <Section title="invoice" icon={Landmark} delay={0.05}>
                <InputBox
                  title="Container No."
                  value={form.containerNo}
                  handleChangeFunction={handleChange}
                  inputFor="containerNo"
                  placeholder="-"
                  icon={<Container size={13} />}
                />
                <InputBox
                  title="Container Seal No."
                  value={form.containerSealNo}
                  handleChangeFunction={handleChange}
                  inputFor="containerSealNo"
                  placeholder="-"
                />

                <InputBox
                  title="Flight No."
                  value={form.flightNo}
                  handleChangeFunction={handleChange}
                  inputFor="flightNo"
                  placeholder="-"
                  icon={<Plane size={13} />}
                />
                <InputBox
                  title="Train No."
                  value={form.trainNo}
                  handleChangeFunction={handleChange}
                  inputFor="trainNo"
                  placeholder="-"
                  icon={<Train size={13} />}
                />


                <CheckboxDateField
                  label="Container Stuffing Date"
                  checked={form.containerStuffingDate}
                  onChange={handleCheckbox("containerStuffingDate", "containerStuffingDateVal")}
                  name="containerStuffingDate"
                  dateValue={form.containerStuffingDateVal}
                  dateField="containerStuffingDateVal"
                  setForm={setform}
                  markDirty={markDirty}
                />


                <CheckboxDateField
                  label="Rail Out Date"
                  checked={form.railOutDate}
                  onChange={handleCheckbox("railOutDate", "railOutDateVal")}
                  name="railOutDate"
                  dateValue={form.railOutDateVal}
                  dateField="railOutDateVal"
                  setForm={setform}
                  markDirty={markDirty}
                />

              </Section>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>

  )
}