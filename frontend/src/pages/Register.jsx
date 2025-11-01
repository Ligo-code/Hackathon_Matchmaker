import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuthStore } from "../store/useAuthStore";

// ✅ MUST BE TOP-LEVEL (Fixes your Vite 'import/export' error)
const INTEREST_OPTIONS = [
  "Ecology",
  "Economics",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI&ML",
  "Blockchain",
  "GameDev",
  "IoT",
  "Cybersecurity",
  "Social Impact",
  "E-commerce",
];

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState([]);

  // Enable button only when valid
  const isValid = useMemo(() => {
    return (
      name.trim() &&
      email.trim() &&
      pwd.trim() &&
      role &&
      experience &&
      interests.length > 0
    );
  }, [name, email, pwd, role, experience, interests]);

  const left = (
    <>
      <div className="text-center md:text-left font-eater text-primary tracking-wide leading-none">
        <div className="text-[42px] md:text-[54px] lg:text-[64px]">👻</div>
        <div className="text-[46px] md:text-[58px] lg:text-[72px]">
          JOIN THE
        </div>
        <div className="text-[46px] md:text-[58px] lg:text-[72px]">
          MATCHMAKER
        </div>
      </div>

      <p className="mt-8 text-base md:text-lg text-white/70 max-w-md mx-auto md:mx-0 leading-relaxed">
        Create your Ghost ID and meet your perfect teammate.
      </p>
    </>
  );

  function toggleInterest(val) {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const ok = await register({
      name,
      email,
      password: pwd,
      role,
      experience,
      interests,
    });

    if (ok) {
      navigate("/"); // 👻 redirect to home or dashboard
    }
  }

  return (
    <AuthLayout left={left}>
      <div className="mx-auto max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">
          Create Your Ghost ID
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Already have one?
          <Link
            to="/login"
            className="ml-1 font-semibold text-lime-300 hover:text-lime-200 inline-flex items-center gap-1"
          >
            Log in 👻 →
          </Link>
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <AuthInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <AuthInput
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Create a Password"
            required
          />

          {/* Role Select */}
          <div>
            <label className="mb-1 block text-sm text-white/70">
              Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300"
              required
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>

          {/* Experience Select */}
          <div>
            <label className="mb-1 block text-sm text-white/70">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300"
              required
            >
              <option value="" disabled>
                Select experience
              </option>
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* Interest Multi-select */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Interests (pick at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const active = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`rounded-full px-3 py-1 text-sm transition ${
                      active
                        ? "bg-lime-400/20 text-lime-200 ring-1 ring-lime-300/50"
                        : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <AuthButton type="submit" disabled={!isValid || loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
