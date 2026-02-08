import express from 'express'
import { forgotPassword, loginUser, logoutUser, registerUser } from "../controllers/authController.js"
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../validators/userValidators.js'
import { userLoginSchema } from '../validators/loginSchema.js'

export const authRouter =  express.Router()
authRouter.post('/user/register',validate(registerSchema),registerUser)
authRouter.post('/user/login',validate(userLoginSchema),loginUser)
authRouter.post('/user/logout',logoutUser)
authRouter.post('/user/forgot',forgotPassword)