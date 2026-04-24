import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiredAt: {
        type: Date,
        expires: 180 
    },
    
});

const OTP = mongoose.model("OTP", otpSchema, "otp");
export default OTP;