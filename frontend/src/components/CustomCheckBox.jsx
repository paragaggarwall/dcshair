import { Check } from "lucide-react";
import React from "react";

export default function CustomCheckBox({
    label,
    checked,
    onChange,
    name,
    id,
    valueToRetreive,
    button,
    sizeBig = false,
    isDisabled = false,
    note,
    isMandatory = false,
}) {
    const handleChange = (e) => {
        if (isDisabled) return;

        onChange(e.target.checked);
    };


    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={id || name}
                className={`inline-flex items-center gap-2 ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    } group`}
            >
                {/* Hidden native input for a11y */}
                <input
                    type="checkbox"
                    id={id || name}
                    name={name}
                    checked={checked}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="sr-only"
                />

                {/* Custom checkbox box */}
                <span
                    className="flex-shrink-0 flex items-center justify-center rounded-md border-[1.5px] transition-all duration-200"
                    style={{
                        width: sizeBig ? 20 : 16,
                        height: sizeBig ? 20 : 16,
                        background: checked ? "var(--defaultBgColor)" : "#fff",
                        borderColor: checked ? "var(--defaultBgColor)" : "#e5e7eb",
                        boxShadow: checked
                            ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 15%, transparent)"
                            : "none",
                    }}
                >
                    {checked && (
                        <Check
                            size={sizeBig ? 12 : 10}
                            className="text-black"
                        />
                    )}
                </span>

                {/* Label text */}
                {label && (
                    <span
                        className={`${sizeBig
                            ? "text-[13px] lg:text-[14px]"
                            : "text-[11px] lg:text-[12px]"
                            } font-semibold text-slate-700 select-none leading-none`}
                    >
                        {label}
                        {isMandatory && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </span>
                )}

                {/* Optional action button */}
                {button && <span className="ml-1">{button}</span>}
            </label>

            {/* Note */}
            {note && (
                <span
                    className="text-[10px] text-gray-400 leading-tight truncate px-1"
                    title={note}
                >
                    Note: {note}
                </span>
            )}
        </div>
    );
}
