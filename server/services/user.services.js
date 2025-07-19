import { UserModal } from "../models/User.model.js";

const createUser = async ({fullname, email, password}) => {
    if(!fullname || !email || !password){
        throw new Error("All fields are required")
    }

    const user = UserModal.create({
        fullname,
        email, 
        password
    })

    
    return user;
    
}

export {createUser}

