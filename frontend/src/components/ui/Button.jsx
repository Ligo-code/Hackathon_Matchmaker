export default function Button({ variant = "primary", children, ...props }) {
    const base =
      "px-5 py-2 rounded-full font-inter text-[16px] transition-colors duration-200";
  
    const styles = {
      primary:
        "bg-[var(--color-primary)] text-[var(--color-dark)] font-semibold hover:opacity-90",
      secondary:
        "border border-[var(--color-primary)] text-[var(--color-text)] hover:text-[var(--color-primary)]",
    };
  
    return (
      <button className={`${base} ${styles[variant]}`} {...props}>
        {children}
      </button>
    );
  }
  