import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv/config'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import { authRouter } from './routers/auth.routes.js'

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

await connectDB();

app.get('/', (req, res) => {
    res.send(`Server is running at PORT ${PORT}`)
})

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log('Server is running at PORT', PORT)
})