import {z} from 'zod'

export const userLoginSchema = z.object({
               email:z
               .string()
               .email('invalid email format'),

               password:z
               .string()
               .min(8,"password mush be at least 8 character")

})