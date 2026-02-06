
import {errorHandler} from '../utils/errorHandler.js'

export const errorMiddleware =  (err,req,res,next)=>{

    if(typeof err === 'string'){
        err = new Error(err)
    }
    err.message = err.message || 'Internal server error'
    err.statusCode = err.statusCode || 500
   
    if(err.name === 'CastError'){
        err = new errorHandler('Resource not found',400)
    }
    if(err.code === 11000){
        err = new errorHandler('Duplicate field value',400)
    }
    if(err.name === 'jsonWebToeknError'){
        err =  new errorHandler('Invalid Token',401)
    }
    if(err.name === 'ToeknExpiredError'){
        err =  new errorHandler('Token expired',401)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack: process.env.NODE_ENV === 'PRODUCTION'? null:err.stack

    })
}