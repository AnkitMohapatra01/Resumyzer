import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// check existing user
export const ExistingUser = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return user
    } else {
        return null;
    }
}

// create hash password
export const HashPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

// Create Tokens
export const createTokens = async (name, email) => {
    const accessToken = jwt.sign({ name, email }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken };
}

// check password correction
export const CorrectPassword = async(hash,password)=>{
    const isMatch=await bcrypt.compare(password,hash);
    return isMatch;
}