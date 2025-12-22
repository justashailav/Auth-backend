import express from "express"
import { isAuthenticated } from "../middleware/isAuthenciated.js";
import { ForgotPassword, Login, Register, ResetPassword, UpdatePassword, verifyOTP } from "../controllers/userController.js";
const router =express.Router()

router.post("/register",Register);
router.post("/verify-otp",verifyOTP);
router.post("/login",Login);
// router.get("/logout",isAuthenticated, Logout);
router.post("/password/forgot",ForgotPassword);
router.put("/password/reset/:token",ResetPassword);
router.put("/password/update",isAuthenticated,UpdatePassword);
export default router;