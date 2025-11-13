import express from "express";
import { AdminRegister, adminLogin } from '../controllers/auth.controller';


const router=express.Router();

router.post("/register",AdminRegister);
router.post("/login",adminLogin);

export default router