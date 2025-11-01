import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");

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

  return (
    <AuthLayout left={left}>
      <div className="mx-auto max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">
          Create Your Ghost ID
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Already have one?{" "}
          <Link
            to="/login"
            className="ml-1 font-semibold text-lime-300 hover:text-lime-200 inline-flex items-center gap-1"
          >
            Log in 👻 →
          </Link>
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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
          <AuthInput
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your Role"
            required
          />

          <AuthInput
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Your Skills"
            required
          />

          <AuthInput
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Your Interests"
            required
          />
          <AuthButton type="submit">Sign Up</AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
