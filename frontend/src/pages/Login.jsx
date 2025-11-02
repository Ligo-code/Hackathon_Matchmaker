import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuthStore } from "../store/useAuthStore";

const leftHero = (
  <div className="-translate-y-10 md:-translate-y-12">
    {" "}
    <div className="text-center font-eater text-primary tracking-[0.02em] flex flex-col items-center">
      <div className="text-[42px] md:text-[54px] lg:text-[64px] ghost-wiggle cursor-pointer select-none">
        👻
      </div>
      <div className="text-[46px] md:text-[58px] lg:text-[72px]">HACKATHON</div>
      <div className="text-[46px] md:text-[58px] lg:text-[72px] mt-2">
        MATCHMAKER
      </div>
    </div>
    <p className="mt-5 text-base md:text-lg text-white/200 max-w-md mx-auto leading-relaxed text-center italic">
      Find your perfect teammate this
      <br />
      hackathon — fast &amp; fun!
    </p>
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const canSubmit = useMemo(() => email.trim() && pwd.trim(), [email, pwd]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const ok = await login({ email, password: pwd });
    if (ok) navigate("/dashboard", { replace: true });
  }

  return (
    <AuthLayout left={leftHero}>
      <div className="mx-auto max-w-md mt-6">
        {" "}
        <h2 className="text-3xl font-extrabold leading-tight text-center">
          Welcome Back, <br /> Spooky Friend
        </h2>
        <p className="mt-2 text-sm text-center">
          <span className="text-white/70 font-bold">No Ghost ID yet?</span>
          <Link
            to="/register"
            className="
              ml-2 font-bold inline-flex items-center gap-1
              !text-lime-300 visited:!text-lime-300
              hover:!text-lime-200 hover:underline underline-offset-4
              transition !opacity-100 group
            "
          >
            Sign Up
            <span
              className="
                inline-block transition-transform
                group-hover:rotate-[8deg] group-hover:translate-x-[1px]
              "
              aria-hidden
            >
              💀
            </span>
            →
          </Link>
        </p>
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <AuthInput
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Enter your Password"
            autoComplete="current-password"
            required
          />
          <AuthButton type="submit" disabled={!canSubmit || loading}>
            {loading ? "Logging in..." : "Login"}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
