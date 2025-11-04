import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuthStore } from "../store/useAuthStore";
import { validators } from "../utils/validation";

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

  const [interests, setInterests] = useState([]);

  // Real-time validation errors
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [interestsError, setInterestsError] = useState(null);

  // Validate fields in real-time
  useEffect(() => {
    setNameError(validators.name(name));
  }, [name]);

  useEffect(() => {
    setEmailError(validators.email(email));
  }, [email]);

  useEffect(() => {
    setPasswordError(validators.password(pwd));
  }, [pwd]);

  useEffect(() => {
    setInterestsError(validators.interests(interests));
  }, [interests]);

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
    <div className="-translate-y-10 md:-translate-y-12">
      <div className="text-center font-eater text-primary tracking-[0.02em] flex flex-col items-center">
        <div className="text-[42px] md:text-[54px] lg:text-[64px] ghost-wiggle cursor-pointer select-none">
          👻
        </div>
        <div className="text-[46px] md:text-[58px] lg:text-[72px]">
          HACKATHON
        </div>
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
      navigate("/");
    }
  }

  return (
    <AuthLayout left={left}>
      <div className="mx-auto max-w-md mt-6">
        <h2 className="text-3xl font-extrabold leading-tight text-center">
          Create Your Ghost ID
        </h2>

        <p className="mt-2 text-sm text-center">
          <span className="text-white/70 font-bold">Already one of us?</span>
          <Link
            to="/login"
            className="
              ml-2 font-bold inline-flex items-center gap-1
              !text-lime-300 visited:!text-lime-300
              hover:!text-lime-200 hover:underline underline-offset-4
              transition !opacity-100 group
            "
          >
            Log in
            <span
              className="
                inline-block transition-transform
                group-hover:rotate-[8deg] group-hover:translate-x-[1px]
              "
            >
              👻
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
          <div>
            <AuthInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-400">⚠️ {nameError}</p>
            )}
          </div>

          <div>
            <AuthInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-400">⚠️ {emailError}</p>
            )}
          </div>

          <div>
            <AuthInput
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Create a Password"
              required
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-400">⚠️ {passwordError}</p>
            )}
            {pwd && !passwordError && (
              <p className="mt-1 text-xs text-green-400">✅ Password looks good!</p>
            )}
          </div>

          <div>
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
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▾
              </span>
            </div>
          </div>

          <div>
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
                <option value="middle">Middle</option>
                <option value="senior">Senior</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                ▾
              </span>
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-3 block font-semibold text-center">
              Interests (pick at least one and up to 5)
            </label>

            <div>
              <label className="text-white/70 text-sm mb-3 block font-semibold text-center"></label>

              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {INTEREST_OPTIONS.map((opt) => {
                  const active = interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleInterest(opt)}
                      aria-pressed={active}
                      className={[
                        "pill-wiggle", // 👻 wiggle on hover
                        "px-4 py-1.5 rounded-full text-sm font-medium select-none transition-all duration-200",

                        active
                          ? "bg-lime-300 text-gray-900 border border-lime-400 shadow-md hover:shadow-lg hover:bg-lime-200"
                          : "bg-white/10 text-white/90 border border-white/20 hover:border-lime-300 hover:text-lime-200 hover:bg-white/20 hover:shadow-md",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {interestsError && (
                <p className="mt-2 text-xs text-red-400 text-center">⚠️ {interestsError}</p>
              )}
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
