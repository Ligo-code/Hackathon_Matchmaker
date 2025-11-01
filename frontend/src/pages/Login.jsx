import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuthStore } from "../store/useAuthStore";

const leftHero = (
  <>
    <div className="text-center md:text-left font-eater text-primary tracking-wide leading-none">
      <div className="text-[42px] md:text-[54px] lg:text-[64px]">👻</div>
      <div className="text-[46px] md:text-[58px] lg:text-[72px]">HACKATHON</div>
      <div className="text-[46px] md:text-[58px] lg:text-[72px]">
        MATCHMAKER
      </div>
    </div>
    <p className="mt-8 text-base md:text-lg text-white/70 max-w-md mx-auto md:mx-0 leading-relaxed">
      Find your perfect teammate this hackathon — fast &amp; fun!
    </p>
  </>
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
    if (ok) {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <AuthLayout left={leftHero}>
      <div className="mx-auto max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">
          Welcome Back, <br /> Spooky Friend
        </h2>

        <p className="mt-2 text-sm text-white/70">
          No Ghost ID yet?{" "}
          <Link
            to="/register"
            className="ml-1 font-semibold text-lime-300 hover:text-lime-200 inline-flex items-center gap-1"
          >
            Sign Up <span aria-hidden>💀</span> →
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
          {!canSubmit && (
            <p className="text-xs text-white/50">
              Enter your email and password.
            </p>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}
