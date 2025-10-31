import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const left = (
    <>
      <div className="text-6xl md:text-7xl lg:text-8xl font-creepster text-lime-300 tracking-wider leading-tight">
        <div className="mb-2 text-5xl">👻</div>
        <div>JOIN THE</div>
        <div>MATCHMAKER</div>
      </div>
      <p className="mt-10 text-lg italic text-white/70 max-w-md mx-auto md:mx-0">
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
            className="font-semibold text-lime-300 hover:text-lime-200 inline-flex items-center gap-1"
          >
            Log in →
          </Link>
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault(); /* TODO: register */
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
          <AuthButton type="submit">Sign Up</AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
