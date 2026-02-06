import jwt from "jsonwebtoken"

export const sendToken = (user,statusCode,res)=>{
         const gntToken =  jwt.sign({id: user._id, email:user.email},
               process.env.JWT_SECRET,
               {expiresIn:process.env.JWT_EXPIRES_TIME}
         )          
         const cookieExpire = Number(process.env.COOKIE_EXPIRES_TIME)
         const options = {
             expires : new Date(Date.now()+cookieExpire * 24 * 60 * 60 * 1000),
             httpOnly: true,
             secure:process.env.NODE_ENV === 'PRODUCTION',
             samesite:'lax'
         } 
         res.status(statusCode)
             .cookie('token',gntToken,options)
             .json({success:true ,user})
}