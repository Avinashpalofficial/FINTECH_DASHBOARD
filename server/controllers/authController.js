import { date, success } from "zod";
import { catchAsyncError } from "../middleware/asyncError.js";
import { User } from "../models/userModel.js";
import {errorHandler} from '../utils/errorHandler.js'
import { hashPassword } from "../utils/hashUtils.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail.js";
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
export const logoutUser = catchAsyncError(async(req,res,next)=>{
                res.cookie('token',null,{
                      expires:new Date(0),
                      httpOnly:true,
                      secure:process.env.NODE_ENV === 'PRODUCTION',
                      sameSite:"strict"
                })  
                res.status(200).json({
                        success:true,
                        message:"logout successfully"
                })
})

export  const forgotPassword =  catchAsyncError(async(req,res,next)=>{
                        const {email}  = req.body
                        if(!email){
                                return next(new errorHandler("Please fill the required fiedl",400))
                        }
                       const user= await User.findOne({email})
                       if(!user){
                        return next(new errorHandler("Kindly signup our website",400))
                       } 
                   const resetTokenFunction  =   ()=>{
                        
                        
                               const resetToekn =  crypto.randomBytes(20).toString('hex')
                               //Hash the resetToken
                               user.resetPasswordToken = crypto
                                                        .createHash('sha256')
                                                        .update(resetToekn)
                                                        .digest('hex')
                                user.resetPasswordExpire=Date.now()+10*60*1000 
                                 return resetToekn                      
                   }  
                    const holdRestToken = resetTokenFunction()
                    await user.save({validateBeforeSave:false})
                    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/user/password/reset/${holdRestToken}`;
                    const message=`
                  <!DOCTYPE html>
                  <html>
                  <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Password Reset</title>
                  
                  <style>
                  body {
                      margin: 0;
                      padding: 0;
                      background-color: #f4f6f8;
                      font-family: 'Segoe UI', Arial, sans-serif;
                  }
                  
                  .container {
                      max-width: 600px;
                      margin: 40px auto;
                      background: #ffffff;
                      border-radius: 10px;
                      overflow: hidden;
                      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                  }
                  
                  .header {
                      background: linear-gradient(135deg, #007bff, #0056b3);
                      color: #ffffff;
                      padding: 25px;
                      text-align: center;
                  }
                  
                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }
                  
                  .content {
                      padding: 30px;
                      color: #333333;
                      line-height: 1.6;
                  }
                  
                  .content h2 {
                      margin-top: 0;
                  }
                  
                  .button-wrapper {
                      text-align: center;
                      margin: 30px 0;
                  }
                  
                  .button {
                      background: #007bff;
                      color: #ffffff !important;
                      padding: 14px 32px;
                      text-decoration: none;
                      border-radius: 6px;
                      font-size: 16px;
                      font-weight: 600;
                      display: inline-block;
                      transition: background 0.3s;
                  }
                  
                  .button:hover {
                      background: #0056b3;
                  }
                  
                  .link-box {
                      background: #f1f3f5;
                      padding: 12px;
                      border-radius: 5px;
                      font-size: 13px;
                      word-break: break-all;
                      margin-top: 10px;
                  }
                  
                  .warning {
                      background: #fff3cd;
                      color: #856404;
                      padding: 12px;
                      border-radius: 5px;
                      margin-top: 20px;
                      font-size: 14px;
                  }
                  
                  .footer {
                      background: #f8f9fa;
                      text-align: center;
                      padding: 18px;
                      font-size: 12px;
                      color: #777777;
                  }
                  </style>
                  </head>
                  
                  <body>
                  
                  <div class="container">
                  
                      <!-- Header -->
                      <div class="header">
                          <h1>Your App Name</h1>
                          <p>Password Reset</p>
                      </div>
                  
                      <!-- Content -->
                      <div class="content">
                  
                          <h2>Hello ${user.name},</h2>
                  
                          <p>
                              We received a request to reset your account password.
                              Click the button below to securely set a new password.
                          </p>
                  
                          <div class="button-wrapper">
                              <a href="${resetUrl}" class="button">
                                  Reset Password
                              </a>
                          </div>
                  
                          <p>
                              If the button doesn’t work, copy and paste this link into your browser:
                          </p>
                  
                          <div class="link-box">
                              ${resetUrl}
                          </div>
                  
                          <div class="warning">
                              ⏰ This link will expire in <strong>5 minutes</strong> for security reasons.
                          </div>
                  
                          <p>
                              If you didn’t request this password reset, please ignore this email.
                              Your account is still safe.
                          </p>
                  
                      </div>
                  
                      <!-- Footer -->
                      <div class="footer">
                          <p>
                              © ${new Date().getFullYear()} Your App Name <br>
                              All rights reserved.
                          </p>
                      </div>
                  
                  </div>
                  
                  </body>
                  </html>
                  `;
                  try {
                        await sendEmail({
                             email:user.email,
                             subject:'fintechDashboard password recovery',
                             message,

                        })
                        res.status(200).json({
                                success: true,
                                message: "Password reset email sent",
                        })
                  } catch (error) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpire = undefined;
                        await user.save({ validateBeforeSave: false });
                        return next(new errorHandler("Email could not be sent", 500));
                  }

                  })

   export const resetPassword =  catchAsyncError(async(req,res,next)=>{
                const {newPassword,confirmNewPassword} = req.body
                const {token} = req.params
                if(!newPassword || !confirmNewPassword){
                        return next(new errorHandler('Please fill the required fields',400))
                }
               if(newPassword != confirmNewPassword){
                return next(new errorHandler(' Password is not matched',400))
               }
              const  hashed =     await  hashPassword(req.body.newPassword)
              console.log("hased:",hashed);
              
              const resetPasswordToken =  crypto
                                         .createHash('sha256')
                                         .update(token)
                                         .digest('hex')
              const user =  await User.findOne({
                resetPasswordToken:resetPasswordToken,
                resetPasswordExpire:{$gt: Date.now()} 
              }) 
              if(!user){
                return next(new errorHandler('user is not found',400))
              }
              user.password =hashed,
              user.resetPasswordToken=undefined,
              user.resetPasswordExpire= undefined
           await user.save()
           sendToken(user,200,res)
                                    
   })               


   ///newPassword1234
   //newPassword12345@