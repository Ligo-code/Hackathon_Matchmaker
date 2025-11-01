import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuthStore } from "../store/useAuthStore";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interest, setInterest] = useState("");

  const isValid = useMemo(() => {
    return (
      name.trim() &&
      email.trim() &&
      pwd.trim() &&
      role &&
      experience &&
      interest
    );
  }, [name, email, pwd, role, experience, interest]);

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

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const ok = await register({
      name,
      email,
      password: pwd,
      role,
      experience,
      interests: [interest],
    });

    if (ok) navigate("/");
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

          {/* Role */}
          <div>
            <label className="text-white/60 text-sm mb-1 block"></label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={[
                  "w-full appearance-none rounded-full border-0 bg-white px-5 py-3 shadow outline-none",
                  "ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300",
                  role ? "text-gray-900" : "text-gray-400",
                ].join(" ")}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full-Stack Developer</option>
                <option value="designer">Designer</option>
                <option value="pm">Product Manager</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▾
              </span>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-white/60 text-sm mb-1 block"></label>
            <div className="relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={[
                  "w-full appearance-none rounded-full border-0 bg-white px-5 py-3 shadow outline-none",
                  "ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300",
                  experience ? "text-gray-900" : "text-gray-400",
                ].join(" ")}
                required
              >
                <option value="" disabled>
                  Select experience level
                </option>
                <option value="junior">Junior</option>
                <option value="middle">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▾
              </span>
            </div>
          </div>

          {/* Interests (pick at least one) */}
          <div>
            <label className="text-white/60 text-sm mb-1 block"></label>
            <div className="relative">
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className={[
                  "w-full appearance-none rounded-full border-0 bg-white px-5 py-3 shadow outline-none",
                  "ring-1 ring-white/10 focus:ring-2 focus:ring-lime-300",
                  interest ? "text-gray-900" : "text-gray-400",
                ].join(" ")}
                required
              >
                <option value="" disabled>
                  Select interest
                </option>
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▾
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50"></p>
          </div>

          <AuthButton type="submit" disabled={!isValid || loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
