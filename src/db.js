import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/fittrack")
        console.log("BASE DE DATOS CONECTADA")
    } catch (error) {
        console.error(error)
    }
}