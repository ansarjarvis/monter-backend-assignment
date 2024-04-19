import express from "express";

import {
  registerUser,
  varifyUser,
  updateUser,
  loginUser,
  userInfo,
} from "../controllers/auth.js";
import authMiddleware from "../middleware.js";

let router = express.Router();

router.post("/register", registerUser);

router.post("/varify", varifyUser);

router.post("/login", loginUser);

router.put("/update-profile", authMiddleware, updateUser);

router.get("/user-info", authMiddleware, userInfo);

export default router;
