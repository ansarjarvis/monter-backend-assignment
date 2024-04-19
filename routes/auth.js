import express from "express";

import { registerUser } from "../controllers/auth.js";

let router = express.Router();

router.post("/register", registerUser);

export default router;
