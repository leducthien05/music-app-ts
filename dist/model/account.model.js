"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const accountSchema = new mongoose_1.default.Schema({
    fullName: String,
    phone: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: () => crypto_1.default.randomBytes(32).toString("hex")
    },
    role_id: String,
    avatar: String,
    status: {
        type: String,
        default: 'active'
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedBy: {
            type: Date
        }
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    }
});
const Account = mongoose_1.default.model('Account', accountSchema, 'account');
exports.default = Account;
