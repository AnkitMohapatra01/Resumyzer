import express from 'express';
import { Login, Logout, Register } from '../controllers/user.controller.js';

export const authRouter = express.Router();

authRouter.post('/register', Register)
authRouter.post('/login', Login)
authRouter.post('/logout', Logout)