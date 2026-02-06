import { catchAsyncError } from "./asyncError.js";
import  {errorHandler}  from "../utils/errorHandler.js"

export const validate=    (schema)=>catchAsyncError(async(req ,res ,next)=>{
                   const result =  await schema.safeParseAsync(req.body)
                   if(!result.success){
                     return next(new errorHandler(result.error.issues[0].message,400))
                   }
                   req.body =result.data
                   next()
})