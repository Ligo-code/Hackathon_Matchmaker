import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // закрываем выпадашку при клике вне
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <p className="text-[var(--color-muted)] text-sm mb-2">{label}</p>
      )}

      {/* Поле */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex justify-between items-center rounded-full px-5 py-2
          border transition-all duration-200
          ${
            open
              ? "border-[var(--color-primary)]"
              : "border-[var(--color-border-soft)] hover:border-[var(--color-primary)]"
          }
          bg-[var(--color-surface)] text-[var(--color-text)]
        `}
      >
        <span className="capitalize">
          {value || `Select ${label?.toLowerCase()}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-muted)] transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Выпадающий список */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2
            bg-[var(--color-surface)] border border-[var(--color-border-soft)]
            rounded-xl shadow-lg z-20 overflow-hidden
          "
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`
                block w-full text-left px-5 py-2 capitalize
                text-[var(--color-text)]
                transition-all duration-150
                hover:bg-[var(--color-border-soft)]
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
