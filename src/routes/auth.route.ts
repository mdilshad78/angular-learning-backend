import express from "express";
import { AdminRegister, adminLogin } from '../controllers/auth.controller';
import { verifyToken } from "../middleware/adminMiddleware";


const router = express.Router();

router.post("/register", AdminRegister);
router.post("/login", adminLogin);
router.get("/verify", verifyToken)

export default router