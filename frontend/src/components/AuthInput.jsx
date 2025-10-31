export default function AuthInput({
  type = "text",
  value,
  onChange,
  placeholder,
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-full border-0 bg-white px-5 py-3 text-gray-900 placeholder-gray-400 shadow outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300"
      {...props}
    />
  );
}
