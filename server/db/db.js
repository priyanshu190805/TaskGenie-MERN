import mongoose from "mongoose";

function connectToDb(){
    mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
        console.log("Connected to DB")
    }).catch(err => console.log(err))
}

export {connectToDb}