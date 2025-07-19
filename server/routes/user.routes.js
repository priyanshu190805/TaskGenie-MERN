import express from "express"
import {body} from "express-validator"
import { loginUser, logoutUser, paymentRazorPay, refreshAccessToken, registerUser, userCredits, verifyRazorpay } from "../controllers/user.controller.js"
import { authUser } from "../middlewares/auth.js"

const router = express.Router()

router.post("/register", [
    body('email').isEmail().withMessage("Invalid email"),
    body('fullname').isLength({min : 3}).withMessage("Full name must be atleast 3 characters long"),
    body('password').isLength({min : 3}).withMessage("Password must be atleast 3 characters long")
], registerUser)

router.post('/login', [
    body('email').isEmail().withMessage("Invalid email"),
    body('password').isLength({min : 3}).withMessage("Password must be atleast 3 characters long")
], loginUser)

router.get("/credits", authUser, userCredits)

router.post("/pay-razor", body('planName').isIn('Basic', 'Advanced', 'Business').withMessage("Plan must be Basic, Advanced or Business") ,authUser, paymentRazorPay)

router.post("/verify-razor", verifyRazorpay)

router.post("/refresh-token", refreshAccessToken)

router.post('/logout', authUser, logoutUser)

export default router;