import { Router } from "express";
import authRoutes from '../routes/auth.route'


const router=Router();

router.use("/admin",authRoutes)

export default router;