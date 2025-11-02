import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", me);
router.post("/logout", logout);

export default router;
