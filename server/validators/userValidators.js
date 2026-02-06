import  {email, z} from 'zod'
export const registerSchema =  z.object({
    name : z
         .string()
         .min(2,'Name must be at least 2 characters')
         .max(50,'Name must be at most 50 characters')
         .trim(),

    email:z
           .string()
           .email('invalid email address')
           .transform((val)=>val.toLowerCase().trim()),
    phone: z 
           .string()
           .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    password:z
            .string()
            .min(8,"Password must be at least 8 characters")
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,"Password must contain uppercase, lowercase, number and symbol"),
    role:z
         .enum(["user","admin"]) 
         .optional(),
                      
    isEmailVerified:z
                   .boolean()
                   .optional(),
    createdBy:z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID")
            .optional()               
})
