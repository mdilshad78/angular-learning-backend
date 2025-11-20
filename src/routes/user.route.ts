import express from 'express'
import { deleteUser, getAllUserData, getOneUserData, profiledataedit, userLogin, userResister } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

router.post("/register", userResister);
router.post("/login", userLogin);

router.get("/userdata", getAllUserData)
router.delete("/deleteUser/:id", deleteUser)

router.get("/me/:id", authMiddleware, getOneUserData)
router.put("/profile/:id", authMiddleware, profiledataedit)

export default router