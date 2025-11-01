export default function AuthLayout({ left, children }) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center">
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1120px] px-6 md:px-10 lg:px-16 py-10">
        <div className="grid grid-cols-1 items-center gap-10 md:[grid-template-columns:minmax(0,1fr)_26rem] md:gap-[4.5rem]">
          <div className="min-w-0 pr-2 md:pr-8">{left}</div>
          <div className="min-w-0 w-full">
            <div className="w-full max-w-[26rem] ml-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
