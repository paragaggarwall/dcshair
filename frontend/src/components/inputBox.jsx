// import React, { useState, useEffect, useRef } from "react";

// export default function InputBox({
//   title,
//   value,
//   handleChangeFunction,
//   note,
//   measure,
//   inputFor,
//   type = "text",
//   isSufixOrPrefix = "noSufixNorPrefix",
//   isDecimalAllowed = false,
//   isInputBoxDisabled = false,
//   placeholder,
//   isMandatory = false,
//   sizeBig = false,
//   cursor = "",
//   border,
//   icon,
//   isLoading = false,
//   autoComplete = 'off', 
// }) {
//   const [focused, setFocused] = useState(false);

//   // Internal display value keeps raw string so decimals/trailing dots aren't stripped
//   const [displayValue, setDisplayValue] = useState(
//     value !== undefined && value !== null ? String(value) : ""
//   );

//   // Track whether the user is actively typing to avoid overwriting mid-input
//   const isTypingRef = useRef(false);

//   // Sync external value → display value only when NOT typing
//   useEffect(() => {
//     if (!isTypingRef.current) {
//       const incoming =
//         value !== undefined && value !== null ? String(value) : "";
//       // Avoid resetting if the numeric content is the same
//       // e.g. external "3" should not overwrite internal "3."
//       const numericMatch =
//         type === "number" &&
//         parseFloat(incoming) === parseFloat(displayValue) &&
//         displayValue.endsWith(".");
//       if (!numericMatch) {
//         setDisplayValue(incoming);
//       }
//     }
//   }, [value]);

//   const handleKeyDown = (e) => {
//     if (type === "number") {
//       const allowedKeys = [
//         "Backspace",
//         "Delete",
//         "ArrowLeft",
//         "ArrowRight",
//         "Tab",
//         "Home",
//         "End",
//       ];
//       const isCtrlCmd = e.ctrlKey || e.metaKey;
//       const isNumberKey = /^[0-9]$/.test(e.key);
//       const isDecimal = e.key === ".";
//       const currentValue = String(displayValue ?? "");

//       // Allow clipboard shortcuts
//       if (isCtrlCmd && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase()))
//         return;

//       // Allow navigation/editing keys
//       if (allowedKeys.includes(e.key)) return;

//       // Allow digits
//       if (isNumberKey) return;

//       // Allow decimal only if permitted and not already present
//       if (isDecimal) {
//         if (!isDecimalAllowed || currentValue.includes(".")) {
//           e.preventDefault();
//         }
//         return;
//       }

//       // Block everything else
//       e.preventDefault();
//     }
//   };

//   const handleChange = (e) => {
//     const raw = e.target.value;

//     if (type === "number") {
//       // Allow empty, digits, and optionally a single decimal point
//       const isValid = isDecimalAllowed
//         ? /^[0-9]*\.?[0-9]*$/.test(raw)
//         : /^[0-9]*$/.test(raw);

//       if (!isValid && raw !== "") return;

//       isTypingRef.current = true;
//       setDisplayValue(raw);

//       // Bubble up a synthetic event with the raw string value
//       // so the parent can choose to parse or keep as string
//       handleChangeFunction({
//         ...e,
//         target: { ...e.target, value: raw, name: inputFor, id: inputFor },
//       });

//       // Release typing lock after a short delay
//       clearTimeout(handleChange._timer);
//       handleChange._timer = setTimeout(() => {
//         isTypingRef.current = false;
//       }, 300);
//     } else {
//       setDisplayValue(raw);
//       handleChangeFunction(e);
//     }
//   };

//   const handlePaste = (e) => {
//     if (type === "number") {
//       const pasted = e.clipboardData.getData("text");
//       const pattern = isDecimalAllowed ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
//       if (!pattern.test(pasted)) {
//         e.preventDefault();
//       }
//     }
//   };

//   const handleBlur = () => {
//     setFocused(false);
//     isTypingRef.current = false;

//     // Clean up trailing dot on blur e.g. "3." → "3"
//     if (type === "number" && displayValue.endsWith(".")) {
//       const cleaned = displayValue.slice(0, -1);
//       setDisplayValue(cleaned);
//       handleChangeFunction({
//         target: { value: cleaned, name: inputFor, id: inputFor },
//       });
//     }
//   };

//   const inputProps = {
//     type: "text", // Always text to prevent browser number quirks
//     inputMode: type === "number" ? "decimal" : undefined,
//     name: inputFor,
//     id: inputFor,
//     placeholder,
//     value: displayValue,
//     disabled: isInputBoxDisabled,
//     onChange: handleChange,
//     onKeyDown: handleKeyDown,
//     onPaste: handlePaste,
//     onFocus: () => setFocused(true),
//     onBlur: handleBlur,
//     autoComplete,
//   };

//   return (
//     <div className="w-full">
//       {title && (
//         <label
//           htmlFor={inputFor}
//           className={`flex items-center min-w-0 ${
//             sizeBig
//               ? "text-[13px] lg:text-[14px]"
//               : "text-[11px] lg:text-[12px]"
//           } font-semibold mb-1.5 text-slate-700`}
//         >
//           <span className="truncate">{title}</span>
//           {isMandatory && (
//             <span className="text-red-500 ml-1 flex-shrink-0">*</span>
//           )}
//         </label>
//       )}

//       <div
//         className={`flex items-center gap-1.5 px-2.5 rounded-xl transition-all duration-200 relative ${
//           isInputBoxDisabled
//             ? "bg-gray-100 cursor-not-allowed opacity-80"
//             : "bg-white"
//         }`}
//         style={{
//           border: `1.5px solid ${
//             isInputBoxDisabled
//               ? "#e5e7eb"
//               : focused
//               ? "var(--defaultBgColor)"
//               : "#e5e7eb"
//           }`,
//           boxShadow:
//             focused && !isInputBoxDisabled
//               ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 10%, transparent)"
//               : "none",
//         }}
//       >
//         <style>{`
//           #${inputFor}:-webkit-autofill,
//           #${inputFor}:-webkit-autofill:hover,
//           #${inputFor}:-webkit-autofill:focus {
//             -webkit-box-shadow: 0 0 0px 1000px white inset !important;
//             -webkit-text-fill-color: #1f2937 !important;
//             transition: background-color 5000s ease-in-out 0s;
//           }
//         `}</style>

//         {icon && (
//           <span
//             className="flex-shrink-0"
//             style={{
//               color: focused ? "var(--defaultBgColor)" : "#9ca3af",
//               fontSize: 16,
//               display: "flex",
//               alignItems: "center",
//               transition: "color 0.15s",
//             }}
//           >
//             {icon}
//           </span>
//         )}

//         {/* Skeleton Loader Overlay */}
//         {isLoading && (
//           <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[1px] animate-pulse z-10 pointer-events-none" />
//         )}

//         {isSufixOrPrefix === "prefix" && (
//           <span className="text-[11px] font-bold text-gray-400 border-r border-gray-100 pr-2 whitespace-nowrap flex-shrink-0">
//             {measure}
//           </span>
//         )}

//         <input
//           {...inputProps}
//           style={{
//             flex: 1,
//             minWidth: 0,
//             border: "none",
//             outline: "none",
//             background: "transparent",
//             fontSize: sizeBig ? "0.95rem" : "0.875rem",
//             color: isInputBoxDisabled ? "#6b7280" : "#1f2937",
//             padding: sizeBig ? "0.75rem 0" : "0.55rem 0",
//             boxShadow: "none",
//           }}
//           className={`placeholder-gray-400 focus:outline-none focus:ring-0 ${cursor} w-full disabled:cursor-not-allowed`}
//         />

//         {isSufixOrPrefix === "sufix" && (
//           <span className="text-[11px] font-bold text-gray-400 border-l border-gray-100 pl-2 whitespace-nowrap flex-shrink-0">
//             {measure}
//           </span>
//         )}
//       </div>

//       {note && (
//         <span
//           className="text-[10px] text-gray-400 mt-1 block leading-tight truncate px-1"
//           title={note}
//         >
//           Note: {note}
//         </span>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Calendar, Settings, ChevronLeft, ChevronRight, X, Check } from "lucide-react";



function DateFormatModal({ onClose, onApply, currentFormat }) {
  const SEPARATORS = ["/", "-", ".", " ", ""];

  const defaultParts = (() => {
    for (const sep of ["/", "-", ".", " "]) {
      const p = currentFormat?.split(sep);
      if (p?.length === 3) return { p0: p[0], p1: p[1], p2: p[2], sep };
    }
    return { p0: "DD", p1: "MM", p2: "YYYY", sep: "/" };
  })();

  const [order, setOrder] = useState([defaultParts.p0, defaultParts.p1, defaultParts.p2]);
  const [sep, setSep] = useState(defaultParts.sep);

  const ALL_TOKENS = ["DD", "D", "MM", "M", "MMM", "MMMM", "YYYY", "YY"];
  const TOKEN_LABELS = {
    DD: "Day (01)", D: "Day (1)", MM: "Month (01)", M: "Month (1)",
    MMM: "Mon", MMMM: "Month", YYYY: "Year (2026)", YY: "Year (26)",
  };

  const sample = (() => {
    const d = new Date();
    const map = {
      DD: String(d.getDate()).padStart(2, "0"), D: String(d.getDate()),
      MM: String(d.getMonth() + 1).padStart(2, "0"), M: String(d.getMonth() + 1),
      MMM: d.toLocaleString("default", { month: "short" }),
      MMMM: d.toLocaleString("default", { month: "long" }),
      YYYY: String(d.getFullYear()), YY: String(d.getFullYear()).slice(2),
    };
    return order.map(t => map[t] || t).join(sep);
  })();

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-[360px] shadow-2xl overflow-visible">

        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 text-xs  bg-[#003366] font-bold rounded-3xl m-2 text-white">
          <Settings size={14} />
          <span>Date Format Configuration</span>

          <button
            onClick={onClose}
            className="ml-auto opacity-80 hover:opacity-100 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">

          {/* Order */}
          <div className="mb-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Display Order
          </div>

          <div className="flex gap-2">
            {order.map((token, i) => (
              <div key={i} className="flex-1">
                <div className="mb-1 text-[10px] text-gray-400">
                  Position {i + 1}
                </div>

                <select
                  value={token}
                  onChange={e => {
                    const next = [...order];
                    next[i] = e.target.value;
                    setOrder(next);
                  }}
                  className="w-full px-2 py-1 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                >
                  {ALL_TOKENS.map(t => (
                    <option key={t} value={t}>
                      {TOKEN_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="mt-4 mb-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Separator
          </div>

          <div className="flex flex-wrap gap-2">
            {SEPARATORS.map(s => (
              <button
                key={s || "none"}
                onClick={() => setSep(s)}
                className={`px-3 py-1 text-xs font-mono rounded-md border transition
                  ${sep === s
                    ? "bg-indigo-50 text-indigo-600 border-indigo-600 font-bold"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
              >
                {s === "" ? "None" : `"${s}"`}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg flex flex-col gap-1">
            <span className="text-[10px] tracking-widest text-gray-400 uppercase">
              Sample Display:
            </span>

            <span className="text-lg font-bold text-gray-900">
              {sample}
            </span>

            <span className="text-xs text-gray-600 font-mono">
              ({order.join(sep)})
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-100">

          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onApply(order.join(sep))}
            className="flex items-center gap-1.5 text-[10px] bg-[#003366] font-bold text-white hover:bg-[#004080] px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Check size={13} />
            Apply Format
          </button>
        </div>
      </div>
    </div>
  );
}


function CalendarPicker({ value, onChange, onClose, anchorRef }) {
  const today = new Date();
  const initDate = value ? new Date(value + "T00:00:00") : today;
  const [view, setView] = useState({ year: initDate.getFullYear(), month: initDate.getMonth() });
  const [selected, setSelected] = useState(value ? new Date(value + "T00:00:00") : null);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const prevMonth = () =>
    setView(v => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));

  const nextMonth = () =>
    setView(v => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

  const pick = (day) => {
    const d = new Date(view.year, view.month, day);
    setSelected(d);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    onChange(iso);
    onClose();
  };

  const isSel = (day) =>
    selected &&
    selected.getFullYear() === view.year &&
    selected.getMonth() === view.month &&
    selected.getDate() === day;

  const isToday = (day) =>
    today.getFullYear() === view.year &&
    today.getMonth() === view.month &&
    today.getDate() === day;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      ref={ref}
      className="absolute top-[calc(100%+5px)] right-0 z-[999999] w-[220px] p-2.5 bg-white border border-gray-200 rounded-lg shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
        >
          <ChevronLeft size={13} />
        </button>

        <span className="text-xs font-bold text-gray-900">
          {MONTHS[view.month]} {view.year}
        </span>

        <button
          onClick={nextMonth}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-[2px]">
        {DAYS.map(d => (
          <div
            key={d}
            className="text-[9px] font-semibold text-gray-400 text-center py-[2px]"
          >
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          const selectedDay = day && isSel(day);
          const todayDay = day && isToday(day);

          return (
            <div
              key={i}
              onClick={() => day && pick(day)}
              className={`
                text-[11px] text-center py-[4px] rounded cursor-pointer
                ${!day ? "cursor-default" : ""}
                ${selectedDay ? "bg-[#003366] text-white font-bold" : ""}
                ${!selectedDay && todayDay ? "bg-green-50 text-green-600 font-bold" : ""}
                ${!selectedDay && !todayDay ? "text-gray-700" : ""}
              `}
            >
              {day || ""}
            </div>
          );
        })}
      </div>

      {/* Today button */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() =>
            pick(today.getDate()) &&
            setView({ year: today.getFullYear(), month: today.getMonth() })
          }
          className="text-xs font-semibold text-[#003366] hover:underline"
        >
          Today
        </button>
      </div>
    </div>
  );
}



export default function InputBox({
  title,
  value,
  handleChangeFunction,
  note,
  measure,
  inputFor,
  type = "text",
  isSufixOrPrefix = "noSufixNorPrefix",
  isDecimalAllowed = false,
  isInputBoxDisabled = false,
  placeholder,
  isMandatory = false,
  sizeBig = false,
  cursor = "",
  border,
  icon,
  isLoading = false,
  autoComplete = 'off',
}) {
  const [focused, setFocused] = useState(false);

  // Internal display value keeps raw string so decimals/trailing dots aren't stripped
  const [displayValue, setDisplayValue] = useState(
    value !== undefined && value !== null ? String(value) : ""
  );

  // Track whether the user is actively typing to avoid overwriting mid-input
  const isTypingRef = useRef(false);

  // ── Date-only state ──
  const isDate = type === "date";
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [showFormat, setShowFormat] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const calBtnRef = useRef();

  // Sync external value → display value only when NOT typing
  useEffect(() => {
    if (!isTypingRef.current) {
      const incoming = value !== undefined && value !== null ? String(value) : "";
      const numericMatch =
        type === "number" &&
        parseFloat(incoming) === parseFloat(displayValue) &&
        displayValue.endsWith(".");
      if (!numericMatch) {
        setDisplayValue(incoming);
      }
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (type === "number") {
      const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
      const isCtrlCmd = e.ctrlKey || e.metaKey;
      const isNumberKey = /^[0-9]$/.test(e.key);
      const isDecimal = e.key === ".";
      const currentValue = String(displayValue ?? "");

      if (isCtrlCmd && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) return;
      if (allowedKeys.includes(e.key)) return;
      if (isNumberKey) return;
      if (isDecimal) {
        if (!isDecimalAllowed || currentValue.includes(".")) e.preventDefault();
        return;
      }
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const raw = e.target.value;

    if (type === "number") {
      const isValid = isDecimalAllowed
        ? /^[0-9]*\.?[0-9]*$/.test(raw)
        : /^[0-9]*$/.test(raw);

      if (!isValid && raw !== "") return;

      isTypingRef.current = true;
      setDisplayValue(raw);

      handleChangeFunction({
        ...e,
        target: { ...e.target, value: raw, name: inputFor, id: inputFor },
      });

      clearTimeout(handleChange._timer);
      handleChange._timer = setTimeout(() => { isTypingRef.current = false; }, 300);
    } else {
      setDisplayValue(raw);
      handleChangeFunction(e);
    }
  };

  const handlePaste = (e) => {
    if (type === "number") {
      const pasted = e.clipboardData.getData("text");
      const pattern = isDecimalAllowed ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
      if (!pattern.test(pasted)) e.preventDefault();
    }
  };

  const handleBlur = () => {
    setFocused(false);
    isTypingRef.current = false;

    if (type === "number" && displayValue.endsWith(".")) {
      const cleaned = displayValue.slice(0, -1);
      setDisplayValue(cleaned);
      handleChangeFunction({ target: { value: cleaned, name: inputFor, id: inputFor } });
    }
  };

  // ── Date helpers ──
  const formatDisplay = (isoVal) => {
    if (!isoVal) return "";
    const d = new Date(isoVal + "T00:00:00");
    if (isNaN(d)) return isoVal;
    const map = {
      DD: String(d.getDate()).padStart(2, "0"), D: String(d.getDate()),
      MM: String(d.getMonth() + 1).padStart(2, "0"), M: String(d.getMonth() + 1),
      MMM: d.toLocaleString("default", { month: "short" }),
      MMMM: d.toLocaleString("default", { month: "long" }),
      YYYY: String(d.getFullYear()), YY: String(d.getFullYear()).slice(2),
    };
    const sep = dateFormat.match(/[\/\-\. ]/) ? dateFormat.match(/[\/\-\. ]/)[0] : "/";
    return dateFormat.split(sep).map(t => map[t] || t).join(sep);
  };

  const handleCalChange = (isoVal) => {
    handleChangeFunction?.({ target: { name: inputFor, id: inputFor, value: isoVal } });
  };

  const inputProps = {
    type: "text",
    inputMode: type === "number" ? "decimal" : undefined,
    name: inputFor,
    id: inputFor,
    placeholder,
    value: displayValue,
    disabled: isInputBoxDisabled,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    onFocus: () => setFocused(true),
    onBlur: handleBlur,
    autoComplete,
  };

  return (
    <div className="w-full">
      {title && (
        <label
          htmlFor={inputFor}
          className={`flex items-center min-w-0 ${sizeBig ? "text-[13px] lg:text-[14px]" : "text-[11px] lg:text-[12px]"
            } font-semibold mb-1.5 text-slate-700`}
        >
          <span className="truncate">{title}</span>
          {isMandatory && <span className="text-red-500 ml-1 flex-shrink-0">*</span>}
        </label>
      )}

      <div
        className={`flex items-center gap-1.5 px-2.5 rounded-xl transition-all duration-200 relative ${isInputBoxDisabled ? "bg-gray-100 cursor-not-allowed opacity-80" : "bg-white"
          }`}
        style={{
          border: `1.5px solid ${isInputBoxDisabled ? "#e5e7eb" : focused ? "var(--defaultBgColor)" : "#e5e7eb"}`,
          boxShadow: focused && !isInputBoxDisabled
            ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 10%, transparent)"
            : "none",
        }}
      >
        <style>{`
          #${inputFor}:-webkit-autofill,
          #${inputFor}:-webkit-autofill:hover,
          #${inputFor}:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1f2937 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>

        {icon && (
          <span
            className="flex-shrink-0"
            style={{ color: focused ? "var(--defaultBgColor)" : "#9ca3af", fontSize: 16, display: "flex", alignItems: "center", transition: "color 0.15s" }}
          >
            {icon}
          </span>
        )}

        {/* Skeleton Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[1px] animate-pulse z-10 pointer-events-none" />
        )}

        {isSufixOrPrefix === "prefix" && (
          <span className="text-[11px] font-bold text-gray-400 border-r border-gray-100 pr-2 whitespace-nowrap flex-shrink-0">
            {measure}
          </span>
        )}

        {/* ── DATE type ── */}
        {isDate ? (
          <>
            {/* Formatted display — styled to match the existing input exactly */}
            <div
              style={{
                flex: 1, minWidth: 0,
                fontSize: sizeBig ? "0.95rem" : "0.875rem",
                color: value ? "#1f2937" : "#9ca3af",
                padding: sizeBig ? "0.75rem 0" : "0.55rem 0",
              }}
            >
              {value
                ? formatDisplay(value)
                : placeholder || `DD/MM/YYYY`}
            </div>

            {/* Hidden input carries the ISO value for forms */}
            <input type="hidden" name={inputFor} id={inputFor} value={value || ""} />

            {/* Format + Calendar buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 2, flexShrink: 0 }}>
              <button
                type="button"
                title="Configure date format"
                onClick={() => { setShowFormat(true); setShowCal(false); }}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", border: "1px solid #e5e7eb", borderRadius: 5, background: "#f9fafb", fontSize: 10, fontWeight: 600, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <Settings size={10} />
                {dateFormat}
              </button>
              <button
                ref={calBtnRef}
                type="button"
                title="Pick a date"
                onClick={() => { setShowCal(v => !v); setShowFormat(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 5, background: "#f9fafb", cursor: "pointer", color: "var(--defaultBgColor, #003366)", flexShrink: 0 }}
              >
                <Calendar size={13} />
              </button>
            </div>

            {/* Calendar popup */}
            {showCal && !isInputBoxDisabled && (
              <CalendarPicker
                value={value}
                onChange={handleCalChange}
                onClose={() => setShowCal(false)}
                anchorRef={calBtnRef}
              />
            )}
          </>
        ) : (
          /* ── ALL OTHER types (text, number, email, …) — UNCHANGED ── */
          <input
            {...inputProps}
            style={{
              flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
              fontSize: sizeBig ? "0.95rem" : "0.875rem",
              color: isInputBoxDisabled ? "#6b7280" : "#1f2937",
              padding: sizeBig ? "0.75rem 0" : "0.55rem 0",
              boxShadow: "none",
            }}
            className={`placeholder-gray-400 focus:outline-none focus:ring-0 ${cursor} w-full disabled:cursor-not-allowed`}
          />
        )}

        {isSufixOrPrefix === "sufix" && (
          <span className="text-[11px] font-bold text-gray-400 border-l border-gray-100 pl-2 whitespace-nowrap flex-shrink-0">
            {measure}
          </span>
        )}
      </div>

      {note && (
        <span className="text-[10px] text-gray-400 mt-1 block leading-tight truncate px-1" title={note}>
          Note: {note}
        </span>
      )}

      {/* Date Format Modal — rendered outside the field div */}
      {showFormat && !isInputBoxDisabled && (
        <DateFormatModal
          currentFormat={dateFormat}
          onClose={() => setShowFormat(false)}
          onApply={(fmt) => { setDateFormat(fmt); setShowFormat(false); }}
        />
      )}
    </div>
  );
}













