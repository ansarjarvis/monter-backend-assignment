import express from "express";

import { registerUser, varifyUser } from "../controllers/auth.js";

let router = express.Router();

router.post("/register", registerUser);
router.post("/varify", varifyUser);

export default router;
