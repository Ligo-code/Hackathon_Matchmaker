import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET = "dev_secret_change_me", NODE_ENV = "development" } =
  process.env;

function sign(uid) {
  return jwt.sign({ uid }, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,                     
    sameSite: isProduction ? "None" : "Lax",  
    domain: isProduction ? ".onrender.com" : undefined, 
    path: "/",                                
    maxAge: 7 * 24 * 60 * 60 * 1000,          
  });
}

export async function register(req, res) {
  try {
    const { name, email, password, role, experience, interests } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !experience ||
      !interests?.length
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      experience,
      interests,
    });

    const token = sign(user._id);
    setAuthCookie(res, token);

    const safe = user.toObject();
    delete safe.password;
    res.status(201).json({ user: safe });
  } catch (e) {
    console.error("REGISTER error:", e);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign(user._id);
    setAuthCookie(res, token);

    const safe = user.toObject();
    delete safe.password;
    res.json({ user: safe });
  } catch (e) {
    console.error("LOGIN error:", e);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthenticated" });
    const { uid } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(uid);
    if (!user) return res.status(401).json({ message: "Unauthenticated" });
    res.json({ user });
  } catch {
    return res.status(401).json({ message: "Unauthenticated" });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: NODE_ENV === "production" ? "None" : "Lax",
    secure: NODE_ENV === "production",
  });
  res.json({ ok: true });
}
