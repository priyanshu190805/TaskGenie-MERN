import dotenv from "dotenv";
dotenv.config();
import { validationResult } from "express-validator";
import { UserModal } from "../models/User.model.js";
import { createUser } from "../services/user.services.js";
import jwt from 'jsonwebtoken'
import Razorpay from "razorpay"
import { TransactionModel } from "../models/transaction.model.js";


const registerUser = async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }

    try {
        const {fullname, email, password} = req.body

    const isUserAlreadyExist = await UserModal.findOne({email})

    if(isUserAlreadyExist){
        return res.status(400).json({message : "User already exists"})
    }

    const hashedPassword = await UserModal.hashPassword(password)

    if(!hashedPassword){
        return res.status(400).json("No hashed Passoword")
    }

    const user = await createUser({
        fullname,
        email,
        password : hashedPassword
    })

    const {accessToken, refreshToken} = await user.generateTokens()
    user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        const options = {
            httpOnly : true,
            secure : false,
            sameSite: 'Lax'
        }
 
        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        res.status(201).json({accessToken, user})
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: "User Registration failed!" });
    }
}

const loginUser = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const {email, password} = req.body

        const user = await UserModal.findOne({ email }).select("+password")

        if(!user){
            return res.status(400).json({message : "Invalid email or password"})
        }

        const isPasswordCorrect = await user.comparePasswords(password)

        if(!isPasswordCorrect){
           return res.status(400).json({message : "Invalid password"})
        }

        const {accessToken, refreshToken} = await user.generateTokens()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        const options = {
            httpOnly : true,
            secure : false,
            sameSite: 'Lax'
        }

        res.cookie("accessToken", accessToken, options)
        res.cookie("refreshToken", refreshToken, options)

        res.status(200).json({accessToken, user})
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: "Incorrect Username or Password!" });
    }
}

const refreshAccessToken = async (req, res) => {
    console.log("Refresh route hit")
    const incomingRefreshToken = req.cookies.refreshToken

    if(!incomingRefreshToken){
        return res.status(400).json({message : "Refresh Token is Missing"})
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await UserModal.findById(decodedToken._id).select("+refreshToken")

        if(!user){
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if(incomingRefreshToken !== user?.refreshToken){
            return res.status(400).json({message : "Refresh token expired or used"})
        }

        const {accessToken, refreshToken : newRefreshToken} = await user.generateTokens();

        user.refreshToken = newRefreshToken

        await user.save({validateBeforeSave : false})

        const options = {
            httpOnly : true,
            secure : false
        }

        res.cookie('refreshToken', newRefreshToken, options)
        res.cookie('accessToken', accessToken, options)
        
        res.status(200).json({accessToken, user})
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

const userCredits = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400).json({error : errors.array()})
    }
    
    try {

    const user = await UserModal.findById(req.user?._id)

    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({credits : user.creditBalance, user})

    } catch (error) {
        console.log(error)
        return res.status(400).json("Unable to fetch credits")
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.accessToken

    if(!token){
        return res.status(400).json({ message: "No access token found" });
    }

    const user = await UserModal.findById(req.user?._id).select("+refreshToken")

    user.refreshToken = null;

    const options = {
        httpOnly : true,
        secure : false
    }

    res.clearCookie("accessToken", options)
    res.clearCookie("refreshToken", options)

    res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.log(error)
        return res.status(400).json("Internal Server Error")
    }
}

const razorpayInstance = new Razorpay({
    key_id : process.env.RAZOR_PAY_KEY_ID,
    key_secret : process.env.RAZOR_PAY_KEY_SECRET
})

const paymentRazorPay = async (req, res) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty){
        return res.status(400).json({error : errors.array()})
    }
    try {
        const {planName} = req.body
        const userId = req.user?._id

        if(!planName){
            return res.status(400).json({message : "Missing Details"})
        }

        let credits, plan, amount, date

        switch (planName) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;

            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;

            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
        
            default:
                return res.status(400).json({message : "Plan not found"});
        }

        date = Date.now()

        const transactionData = {
            userId ,plan, amount, credits, date
        }

        const newTransaction = await TransactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency : process.env.CURRENCY,
            receipt : newTransaction._id
        }

        const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(order);

    } catch (error) {
        console.log(error)
        res.json(400).json({message : error.message})
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            const transactionData = await TransactionModel.findById(orderInfo.receipt)
            if(transactionData.payment){
                return res.status(400).json({message : "Payment Failed"})
            }

            const userData = await UserModal.findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.credits

            await UserModal.findByIdAndUpdate(userData._id, {creditBalance})

            await TransactionModel.findByIdAndUpdate(transactionData._id, {payment : true})

            res.status(200).json({message : "Credit added"})
        }
        else {
            res.json(400).json({message : 'Payment Failed'})
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({message : error.message})
    }
}

export {registerUser, loginUser, userCredits, refreshAccessToken, logoutUser, paymentRazorPay, verifyRazorpay}