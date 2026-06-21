import mongoose from 'mongoose'

export const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/resumyzer`)
        console.log('Database connected Succesfully')
    } catch (error) {
        console.error('Error while connecting with DB:',error);
    }
}