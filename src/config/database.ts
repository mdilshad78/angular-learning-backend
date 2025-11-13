import mongoose from "mongoose";

export async function DBConnection() {
    try {
        if (mongoose.connection.readyState >= 1) return

        if(!process.env.MONGO_URL){
            throw new Error("❌ MONGO_URI not found in environment variables")
        }
        
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"test-angular"
        })
        console.log("✅ MongoDB Connected Successfully")
    }
    catch (err) {
        console.error("MongoDB Connection Failed", err)
    }
}