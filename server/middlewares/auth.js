import jwt from "jsonwebtoken"
import { UserModal } from "../models/User.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json('Unauthorized User')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModal.findById(decoded._id);

        req.user = user;

        return next()
    } catch (error) {
        return res.status(401).json('Unauthorized')
    }
}

export {authUser}