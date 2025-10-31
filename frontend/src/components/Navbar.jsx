import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/requests", label: "Requests" },
    { to: "/messages", label: "Messages" },
    { to: "/profile", label: "My profile" },
  ];

  return (
    <header className="w-full bg-dark flex flex-col items-center gap-4 pt-6 pb-4">
      <h1 className="text-primary font-eater text-[42px] tracking-wide leading-none">
        HACKATHON MATCHMAKER
      </h1>

      <nav className="w-full flex justify-center px-6">
        <ul
          className="
            flex items-center gap-14
            bg-[var(--color-surface)]
            border border-[var(--color-border-soft)]
            rounded-full
            px-10 py-4
          "
        >
          {links.map(({ to, label }) => {
            const isActive = pathname === to;

            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`px-2 py-1 text-[18px] transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text font-normal hover:text-secondary"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
