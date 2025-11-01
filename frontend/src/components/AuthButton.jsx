export default function AuthButton({ children, ...props }) {
  return (
    <button
      className="mx-auto block w-40 rounded-full bg-lime-300 px-6 py-3 text-center text-gray-900 font-semibold shadow hover:bg-lime-200 active:translate-y-[1px] transition"
      {...props}
    >
      {children}
    </button>
  );
}
