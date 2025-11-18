import { Router } from "express";
import authRoutes from '../routes/auth.route'
import userRoute from '../routes/user.route'


const router = Router();

router.use("/admin", authRoutes)
router.use("/user", userRoute)

export default router;