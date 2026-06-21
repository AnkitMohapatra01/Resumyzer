import { cookieOptions } from "../constants/cookie.constant.js";
import { User } from "../models/user.model.js";
import { CorrectPassword, createTokens, ExistingUser, HashPassword } from "../service/auth.service.js";
// Register Controller
export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check validity
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please Provide all Credentials' })
        }
        // check duplicacy of user
        const isExistingUser = await ExistingUser(email);
        if (isExistingUser) {
            return res.status(400).json({ success: false, message: 'User Already Exists' })
        }
        // create user authentication
        const hashPassword = await HashPassword(password);
        // create user in db
        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();
        // set cookies
        const { accessToken, refreshToken } = await createTokens(name, email);
        res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(201).json({ success: true, message: 'User Registered Successfully' })
    } catch (error) {
        console.error('Error while registering the user', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}


// Login Controller
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check validity
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please Provide all the credentials' })
        }
        // check user existence
        const isExistingUser = await ExistingUser(email);
        if (!isExistingUser) {
            return res.status(401).json({ success: false, message: 'User does not Exist' })
        }
        // check password authenticity
        const isPasswordCorrect = await CorrectPassword(isExistingUser.password, password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' })
        }
        // set cookies
        const { accessToken, refreshToken } = await createTokens(isExistingUser.name, isExistingUser.email);
        res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({ success: true, message: 'User LoggedIn Succesfully' })
    } catch (error) {
        console.error('Error while logging in the user', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// Logout Controller
export const Logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        };
        // clear cookies
        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);
        return res.status(200).json({ success: true, message: 'User Loggedout Successfully' })
    } catch (error) {
        console.error('Error while logging out the user')
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
