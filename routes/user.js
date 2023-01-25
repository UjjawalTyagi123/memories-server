import express from "express";
const router = express.Router();

import { signIn, signup } from "../controllers/user.js";

router.post("/signIn", signIn);
router.post("/signup", signup);

export default router;