export default function AuthLayout({ left, children }) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="pointer-events-none absolute -top-16 -left-20 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative grid min-h-screen w-full grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-16">
        <div className="text-center md:text-left">{left}</div>
        <div className="w-full flex justify-center">{children}</div>
      </div>
    </div>
  );
}
