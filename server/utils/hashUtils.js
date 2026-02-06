import bcrypt from 'bcrypt'

export const hashPassword  =  async(password)=>{
              const saltRound = 10
              const hash =  await bcrypt.hash(password,saltRound)
              return hash;
}


