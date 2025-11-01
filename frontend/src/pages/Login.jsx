import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const left = (
    <>
      <div className="text-6xl md:text-7xl lg:text-8xl font-creepster text-lime-300 tracking-wider leading-tight">
        <div className="mb-2 text-5xl">👻</div>
        <div>HACKATHON</div>
        <div>MATCHMAKER</div>
      </div>
      <p className="mt-10 text-lg italic text-white/70 max-w-md mx-auto md:mx-0">
        Find your perfect teammate this hackathon — fast &amp; fun!
      </p>
    </>
  );

  return (
    <AuthLayout left={left}>
      <div className="mx-auto max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">
          Welcome Back,
          <br /> Spooky Friend
        </h2>

        <p className="mt-2 text-sm text-white/70">
          No ghost ID yet?{" "}
          <Link
            to="/register"
            className="ml-1 font-semibold text-lime-300 hover:text-lime-200 inline-flex items-center gap-1"
          >
            Sign Up <span aria-hidden>💀</span> →
          </Link>
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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
            placeholder="Enter your Password"
            required
          />
          <AuthButton type="submit">Login</AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
}
