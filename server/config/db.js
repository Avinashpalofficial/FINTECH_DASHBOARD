import mongoose from "mongoose"

export const connectDB =  async()=>{
                    try {
                        const connection = await mongoose.connect(process.env.MONGO_URL)
                        console.log("DB is connect");
                        
                    } catch (error) {
                     console.log("DB connection is lost",process.env.MONGO_URL);
                     
                    }   
                }
