import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            minlength:2,
            maxlength:50
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
            index:true,
            match:[
                /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                "Please enter a valid gamil address"
            ]
        },
        phone:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            sparse:true,
             match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"],
        },
        password:{
            type:String,
            required:true,
            select:false,
            minlength:8,
            match:[
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must be strong"
            ]
        },
        role:{
            type:String,
           enum:["user","admin"],
           default:"user" 
        },
        isEmailVerified:{
            type:Boolean,
            default:false

        },

        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
     { timestamps: true }
)
export const User = mongoose.model("User",userSchema)
