import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MultiSelect({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = "Select...",
    required = false,
    disabled = false,
    searchable = true,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        return options.filter((opt) =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const toggleOption = (id) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    const toggleAll = () => {
        if (value.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map((o) => o.id));
        }
    };

    const selectedNames = options
        .filter((o) => value.includes(o.id))
        .map((o) => o.name)
        .join(", ");

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
                    if (disabled) return;
                    setIsOpen(!isOpen);
                }}
                className={`flex items-center justify-between gap-2 px-2.5 rounded-xl transition-all duration-200 relative
          ${disabled ? "bg-gray-100 opacity-80 cursor-not-allowed" : "bg-white cursor-pointer"}`}
                style={{
                    border: `1.5px solid ${
                        disabled
                            ? "#e5e7eb"
                            : isOpen
                            ? "var(--defaultBgColor)"
                            : "#e5e7eb"
                    }`,
                    boxShadow:
                        isOpen && !disabled
                            ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 10%, transparent)"
                            : "none",
                }}
            >
                <span
                    className={`text-sm flex-1 truncate ${
                        selectedNames ? "text-gray-900" : "text-gray-400"
                    }`}
                    style={{
                        padding: "0.55rem 0",
                    }}
                >
                    {selectedNames || placeholder}
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
                        {searchable && (
                            <div className="p-3 border-b border-gray-50">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs focus:outline-none focus:border-[var(--defaultBgColor)]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="px-3 py-2 border-b border-gray-50">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAll();
                                }}
                                className="w-full px-3 py-2 bg-[#003366] hover:bg-[#004080] rounded-lg transition-all shadow-lg shadow-[#003366]/20 cursor-pointer text-white text-xs font-bold"
                            >
                                {value.length === options.length ? "Unselect All" : "Select All"}
                            </button>
                        </div>

                        <div className="max-h-52 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="p-3 text-xs text-gray-400 text-center">
                                    No results found
                                </div>
                            ) : (
                                filteredOptions.map((opt) => {
                                    const checked = value.includes(opt.id);

                                    return (
                                        <label
                                            key={opt.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleOption(opt.id);
                                            }}
                                            className={`px-4 py-3 text-sm cursor-pointer flex items-center gap-3 transition-colors ${
                                                checked
                                                    ? "bg-blue-50 text-[var(--defaultBgColor)] font-semibold"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span
                                                className={`w-4 h-4 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
                                                    checked
                                                        ? "bg-[var(--defaultBgColor)] border-[var(--defaultBgColor)]"
                                                        : "border-gray-300 bg-white"
                                                }`}
                                            >
                                                {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                            </span>

                                            <span className="flex-1 truncate">{opt.name}</span>
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}