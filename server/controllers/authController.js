import { catchAsyncError } from "../middleware/asyncError.js";
import { User } from "../models/userModel.js";
import {errorHandler} from '../utils/errorHandler.js'
import { hashPassword } from "../utils/hashUtils.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from 'bcrypt'
export const registerUser =  catchAsyncError(async(req,res,next)=>{
        console.log("REQ BODY:", req.body);
        const {name,email,phone,password} =req.body
        const existingEmail = await  User.findOne({email})
        if(existingEmail){
                return next (new errorHandler('Email is already exist',400))
        }
        const phoneNo  =await User.findOne({phone})
        if(phoneNo){
                return next (new errorHandler('This  phoneNo is already exist',400))
        }
        const hashpassWord =  await hashPassword(req.body.password)
        const user = await User.create({
                name,
                email,
                phone,
                password:hashpassWord
        })
        console.log("user.password",user.password);
        
        sendToken(user,200,res)
})

export  const loginUser = catchAsyncError(async(req,res,next)=>{
           const {email,password} = req.body
           if(!email || !password){
                return next (new errorHandler("Please fill the required fields",400))
           }
           
           const user = await User.findOne({email}).select('+password')
           if(!user){
                return next(new errorHandler('Please singup our fintech website',400))
           }
           console.log('user:',user);
           
           console.log("password=", password);
          console.log("user.password=", user.password);
           const comparePassword = await bcrypt.compare(password,user.password)

           if(!comparePassword){
                return next (new errorHandler('Invalid Password',400))
           }
           sendToken(user,200,res)

})