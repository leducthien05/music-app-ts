"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    avatar: String,
    status: String,
    password: String,
    tokenUser: {
        type: String,
        default: () => crypto_1.default.randomBytes(32).toString("hex")
    },
    email: String,
    phone: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});
const User = mongoose_1.default.model("User", userSchema, "users");
exports.default = User;
