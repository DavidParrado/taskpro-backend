import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller";
import { validateErrors, validateBody } from "../middlewares/validate-errors";

import {
  validateUser,
  validateUserExists,
  validateUserUpdate,
} from "../validators/user-validators";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", validateUserExists, validateErrors, getUser);
router.post("/users", validateUser, validateErrors, createUser);
router.patch(
  "/users/:id",
  validateUserUpdate,
  validateBody,
  validateErrors,
  updateUser
);
router.delete("/users/:id", validateUserExists, validateErrors, deleteUser);

export default router;
