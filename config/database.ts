import mongoose from "mongoose";

export const connect = async (): Promise<void> =>{
    try {
        const uri: string = process.env.MONGO_URI || "";
        await mongoose.connect(uri);
        console.log(uri);
        console.log("Connect success");
    } catch (error) {
        console.log(error);
    }
}