import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ventilation'
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed (continuing without DB):', error)
    // Do not exit the process in development; allow the API to run without MongoDB
    // so that frontend/deployment verification and non-DB endpoints remain available.
    return
  }
}

export default mongoose
