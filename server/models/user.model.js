import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    creditBalance : {
        type : Number,
        default : 5
    },
    refreshToken: {
      type: String,
      select : false
    },
}, {timestamps : true})

UserSchema.methods.generateAccessToken = function(){
    const accessToken = jwt.sign({_id : this._id}, process.env.JWT_SECRET, {
        expiresIn : "24h"
    })
    return accessToken;
}

UserSchema.methods.generateTokens = function(){
    const accessToken = jwt.sign({_id : this._id}, process.env.JWT_SECRET, {
        expiresIn : "24h"
    })
    const refreshToken = jwt.sign({_id : this._id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn : "7d"
    })
    return {accessToken, refreshToken};
}

UserSchema.methods.comparePasswords = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

export const UserModal = mongoose.model("UserModal", UserSchema)