import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  required = false,
  searchable = true,
  onCreate = null,       // async fn(name) => newOption {id, name} — enables "create new" mode
  createLabel = 'Create new',
  toggleAll = null,
  isDisabled = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  const [createInput, setCreateInput] = useState('');
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = value ? options.find(opt => opt.id.toString() === value.toString()) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setCreating(false);
        setCreateInput('');
        setCreateError('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!createInput.trim()) {
      setCreateError('Name cannot be empty');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      const newOption = await onCreate(createInput.trim());
      onChange(newOption.id);
      setIsOpen(false);
      setCreating(false);
      setCreateInput('');
    } catch (err) {
      setCreateError(err.response?.data?.error || err.message || 'Failed to create');
    } finally {
      setCreateLoading(false);
    }
  };

  // return (
  //   <div className="space-y-1 relative" ref={containerRef}>
  //     {label && (
  //       <label className="text-xs font-bold text-gray ml-1">
  //         {label} {required && <a className='text-red-500'>*</a>}
  //       </label>
  //     )}

  //     {/* <div
  //       onClick={() => { setIsOpen(!isOpen); setCreating(false); setCreateError(''); }}
  //       className={`w-full px-4 py-3 rounded-xl border transition-all text-sm cursor-pointer flex justify-between items-center bg-gray-50/50 ${isOpen ? 'ring-2 ring-[#003366]/10 border-[#003366]' : 'border-gray-200'
  //         }`}
  //     > */}
  //     <div
  //       onClick={() => {
  //         if (isDisabled) return;
  //         setIsOpen(!isOpen);
  //         setCreating(false);
  //         setCreateError('');
  //       }}
  //       className={`w-full px-4 py-3 rounded-xl border transition-all text-sm flex justify-between items-center bg-gray-50/50 cursor-pointer
  //   ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
  //   ${isOpen ? 'ring-2 ring-[#003366]/10 border-[#003366]' : 'border-gray-200'}
  // `}
  //     >
  //       <span className={selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}>
  //         {selectedOption ? selectedOption.name : placeholder}
  //       </span>
  //       <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  //     </div>

  //     <AnimatePresence>
  //       {isOpen && (
  //         <motion.div
  //           initial={{ opacity: 0, y: -10 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           exit={{ opacity: 0, y: -10 }}
  //           className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
  //         >
  //           {searchable && !creating && (
  //             <div className="p-3 border-b border-gray-50">
  //               <div className="relative">
  //                 <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  //                 <input
  //                   autoFocus
  //                   type="text"
  //                   placeholder="Search..."
  //                   value={searchTerm}
  //                   onChange={(e) => setSearchTerm(e.target.value)}
  //                   className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-[#003366]/30 transition-all"
  //                 />
  //               </div>
  //             </div>
  //           )}

  //           {toggleAll && !creating && (
  //             <div className="px-3 py-2 border-b border-gray-50">
  //               <button
  //                 type="button"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   toggleAll.onClick();
  //                 }}
  //                 className="w-full px-3 py-2 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#004080] transition-all"
  //               >
  //                 {toggleAll.label}
  //               </button>
  //             </div>
  //           )}

  //           {/* Create-new inline form */}
  //           {creating && (
  //             <div className="p-3 border-b border-gray-50 space-y-2">
  //               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{createLabel}</p>
  //               <input
  //                 autoFocus
  //                 type="text"
  //                 value={createInput}
  //                 onChange={(e) => { setCreateInput(e.target.value); setCreateError(''); }}
  //                 onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setCreating(false); setCreateInput(''); } }}
  //                 placeholder={`e.g. 50% Advance`}
  //                 className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#003366]/50 transition-all"
  //               />
  //               {createError && (
  //                 <p className="text-[10px] text-red-500 font-semibold">{createError}</p>
  //               )}
  //               <div className="flex gap-2">
  //                 <button
  //                   type="button"
  //                   onClick={handleCreate}
  //                   disabled={createLoading}
  //                   className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#004080] transition-colors disabled:opacity-60"
  //                 >
  //                   {createLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
  //                   Save
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={() => { setCreating(false); setCreateInput(''); setCreateError(''); }}
  //                   className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
  //                 >
  //                   Cancel
  //                 </button>
  //               </div>
  //             </div>
  //           )}

  //           {!creating && (
  //             <div className="max-h-52 overflow-y-auto">
  //               {filteredOptions.length === 0 ? (
  //                 <div className="p-4 text-center text-xs text-gray-400 font-medium italic">
  //                   No results found
  //                 </div>
  //               ) : (
  //                 filteredOptions.map((opt) => (
  //                   <div
  //                     key={opt.id}
  //                     onClick={() => {
  //                       onChange(opt.id);
  //                       setIsOpen(false);
  //                       setSearchTerm('');
  //                     }}
  //                     className={`px-4 py-3 text-sm cursor-pointer transition-colors flex justify-between items-center ${value && value.toString() === opt.id.toString()
  //                       ? 'bg-blue-50 text-[#003366] font-bold'
  //                       : 'hover:bg-gray-50 text-gray-700'
  //                       }`}
  //                   >
  //                     {opt.name}
  //                     {value && value.toString() === opt.id.toString() && (
  //                       <div className="w-1.5 h-1.5 rounded-full bg-[#003366]" />
  //                     )}
  //                   </div>
  //                 ))
  //               )}
  //             </div>
  //           )}

  //           {onCreate && !creating && (
  //             <div
  //               onClick={() => setModalOpen(true)}
  //               className="px-4 py-3 flex items-center gap-2 text-xs font-bold text-[#003366] cursor-pointer hover:bg-blue-50 border-t border-gray-50 transition-colors"
  //             >
  //               <div className="w-5 h-5 rounded-md bg-[#003366] flex items-center justify-center">
  //                 <Plus className="w-3 h-3 text-white" />
  //               </div>
  //               {createLabel}
  //             </div>
  //           )}
  //         </motion.div>
  //       )}
  //     </AnimatePresence>

     
  //   </div>


  // );


  return (
  <div className="w-full relative" ref={containerRef}>
    {label && (
      <label className="flex items-center min-w-0 text-[11px] lg:text-[12px] font-semibold mb-1.5 text-slate-700">
        <span className="truncate">{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}

    <div
      onClick={() => {
        if (isDisabled) return;
        setIsOpen(!isOpen);
        setCreating(false);
        setCreateError("");
      }}
      className={`flex items-center justify-between gap-2 px-2.5 rounded-xl transition-all duration-200 relative
        ${isDisabled ? "bg-gray-100 opacity-80 cursor-not-allowed" : "bg-white cursor-pointer"}`}
      style={{
        border: `1.5px solid ${
          isDisabled
            ? "#e5e7eb"
            : isOpen
            ? "var(--defaultBgColor)"
            : "#e5e7eb"
        }`,
        boxShadow:
          isOpen && !isDisabled
            ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 10%, transparent)"
            : "none",
      }}
    >
      <span
        className={`text-sm flex-1 truncate ${
          selectedOption ? "text-gray-900" : "text-gray-400"
        }`}
        style={{
          padding: "0.55rem 0",
        }}
      >
        {selectedOption ? selectedOption.name : placeholder}
      </span>

      <ChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </div>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden"
        >
          {searchable && !creating && (
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  // autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-[var(--defaultBgColor)]"
                />
              </div>
            </div>
          )}

          {toggleAll && !creating && (
            <div className="px-3 py-2 border-b border-gray-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAll.onClick();
                }}
                className="w-full px-3 py-2 bg-[#003366] hover:bg-[#004080] rounded-lg transition-all shadow-lg shadow-[#003366]/20 cursor-pointer text-white text-xs font-bold"
              >
                {toggleAll.label}
              </button>
            </div>
          )}

          {creating && (
            <div className="p-3 border-b border-gray-50 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {createLabel}
              </p>

              <input
                // autoFocus
                type="text"
                value={createInput}
                onChange={(e) => {
                  setCreateInput(e.target.value);
                  setCreateError("");
                }}
                placeholder="Enter name..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[var(--defaultBgColor)]"
              />

              {createError && (
                <p className="text-[10px] text-red-500 font-semibold">
                  {createError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={createLoading}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--defaultBgColor)] text-white text-xs font-bold"
                >
                  {createLoading ? "..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setCreateInput("");
                    setCreateError("");
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!creating && (
            <div className="max-h-52 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-xs text-gray-400 text-center">
                  No results found
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center transition-colors ${
                      value?.toString() === opt.id.toString()
                        ? "bg-blue-50 text-[var(--defaultBgColor)] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.name}

                    {value?.toString() === opt.id.toString() && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--defaultBgColor)]" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {onCreate && !creating && (
            <div
              onClick={() => setCreating(true)}
              className="px-4 py-3 flex items-center gap-2 text-xs font-bold text-[var(--defaultBgColor)] cursor-pointer hover:bg-blue-50 border-t border-gray-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {createLabel}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
