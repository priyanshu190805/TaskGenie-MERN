import express from 'express'
import {body} from 'express-validator'
import { authUser } from '../middlewares/auth.js'
import { geminiResponse, generateImage, generateReview, removeBg } from '../controllers/tools.controller.js'
import upload from '../middlewares/multer.middleware.js'

const router = express.Router()

router.post('/generate-image',
    body('prompt').isString().withMessage("Invalid prompt"),
    authUser, generateImage
)

router.post('/generate-response', body('prompt').isString().withMessage("Invalid prompt"), geminiResponse)

router.post('/generate-review', body('code').isString().withMessage("Invalid prompt"), authUser, generateReview)

router.post('/remove-bg', upload.single('image'), authUser, removeBg)

export default router;