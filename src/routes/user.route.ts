import express from 'express'
import { userLogin, userResister } from '../controllers/user.controller';

const router = express.Router();

router.post("/register", userResister);
router.post("/login", userLogin)

export default router