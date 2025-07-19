import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    plan : {
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true
    },
    credits : {
        type : Number,
        required : true
    },
    payment: {
      type: Boolean,
      default : false
    },
}, {timestamps : true})

export const TransactionModel = mongoose.model("TransactionModel", TransactionSchema)