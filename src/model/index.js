import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectDb=async()=>{ await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME }`)
console.log("mongodb.connet")}
export default connectDb