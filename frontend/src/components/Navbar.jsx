import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Navigation links for both desktop and mobile
  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/requests", label: "Requests" },
    { to: "/chats", label: "Messages" },
    { to: "/profile", label: "My profile" },
  ];

  return (
    <header className="w-full flex flex-col items-center gap-18 pt-10 md:pt-14 pb-4 relative">
      {/* ===== Desktop layout ===== */}
      <div className="hidden md:flex flex-col items-center gap-18">
        {/* Main logo */}
        <h1 className="text-(--color-primary) font-eater text-[50px] tracking-wide leading-none text-center">
          HACKATHON MATCHMAKER
        </h1>

        {/* Desktop navigation menu */}
        <nav className="w-full flex justify-center px-6">
          <ul
            className="
              flex items-center gap-14
              bg-(--color-surface)
              border border-(--color-border-soft)
              rounded-full
              px-10 py-4
            "
          >
            {menuItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `px-2 py-1 text-[18px] transition-colors ${
                      isActive
                        ? '!text-(--color-primary) font-bold'
                        : 'text-(--color-text) font-normal hover:text-(--color-secondary)'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ===== Mobile layout ===== */}
      <div className="md:hidden flex flex-col items-center">
        {/* Logo on mobile */}
        <h1 className="text-(--color-primary) font-eater text-[36px] tracking-wide leading-none text-center">
          HACKATHON MATCHMAKER
        </h1>

        {/* "Menu" button toggles mobile navigation */}
        <button
          onClick={() => setOpen(!open)}
          className="
            mt-6 px-6 py-2 rounded-full
            bg-(--color-surface)
            text-(--color-primary)
            border border-(--color-border-soft)
            text-[16px] font-semibold
            transition-all hover:opacity-80
          "
        >
          {open ? "✕" : "☰ Menu"}
        </button>

        {/* Collapsible menu appears below the button when open */}
        {open && (
          <nav className="flex flex-col items-center gap-3 mt-10">
            {menuItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[18px] ${
                    isActive
                      ? 'text-(--color-primary) font-bold'
                      : 'text-(--color-text) hover:text-(--color-secondary)'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
