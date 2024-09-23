import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import {
  validateRegistration,
  validateLogin,
} from "../validators/auth-validators";
import { validateErrors } from "../middlewares/validate-errors";

const router = Router();

router.post("/register", validateRegistration, validateErrors, register);
router.post("/login", validateLogin, validateErrors, login);

export default router;
