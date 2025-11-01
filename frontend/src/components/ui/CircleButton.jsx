export default function CircleButton({ direction = "right", onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-12 h-12 flex items-center justify-center
          rounded-full border-2 border-[var(--color-primary)]
          text-[var(--color-primary)] text-2xl
          transition-opacity duration-200
          ${disabled ? "opacity-20 cursor-default" : "hover:opacity-80"}
        `}
      >
        {direction === "left" ? "←" : "→"}
      </button>
    );
  }
  