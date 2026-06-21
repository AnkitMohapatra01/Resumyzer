import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv/config'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send(`Server is running at PORT ${PORT}`)
})

app.listen(PORT, () => {
    console.log('Server is running at PORT', PORT)
})