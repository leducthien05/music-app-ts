import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullName: String,
    avatar: String,
    status: String,
    password: String,
    tokenUser: {
        type: String,
        default: () => crypto.randomBytes(32).toString("hex")
    },
    email: String,
    phone: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, "users");
export default User;