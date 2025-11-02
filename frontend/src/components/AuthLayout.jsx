export default function AuthLayout({ left, children }) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1120px] px-6 md:px-10 lg:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-25 md:gap-40 place-items-center">
          <div className="w-full max-w-[28rem] text-center">{left}</div>
          <div className="w-full max-w-[28rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
