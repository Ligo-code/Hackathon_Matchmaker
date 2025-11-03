import { NavLink } from "react-router-dom";

export default function Navbar() {
  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/requests", label: "Requests" },
    { to: "/chats", label: "Messages" },
    { to: "/profile", label: "My profile" },
  ];

  return (
    <header className="w-full bg-[#0a0a0a] flex flex-col items-center gap-18 pt-14 pb-4">
      <h1 className="text-(--color-primary) font-eater text-[50px] tracking-wide leading-none">
        HACKATHON MATCHMAKER
      </h1>

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
                      ? "!text-(--color-primary) font-bold"
                      : "text-(--color-text) font-normal hover:text-(--color-secondary)"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
