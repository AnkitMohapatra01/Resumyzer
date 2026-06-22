import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'
import { uploadFile } from '../controllers/resume.controller.js'

export const resumeRouter = express.Router()

resumeRouter.post('/upload', authMiddleware, upload.single('resume_file'), uploadFile)